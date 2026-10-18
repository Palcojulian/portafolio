import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useKeyboardControls } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  RigidBody,
  useBeforePhysicsStep,
  useRapier,
  type RapierRigidBody,
} from '@react-three/rapier';
import type { Control } from './keyboardMap';
import type { PlayerUserData } from './Player';

const MODEL_URL = '/3d-models/vehicle.glb';

/**
 * El .glb mide 1,33 × 0,90 × 3,16 (escala 1); así queda a escala del
 * escritorio (40 × 17 × 11,5 cm). Todas las medidas físicas (ruedas,
 * carrocería, batalla) se derivan de `S`.
 */
const S = 0.1275;

/** Pose inicial (la que tenía el coche decorativo). */
const SPAWN_POSITION = new THREE.Vector3(-2, 1.5, 0.2);
const SPAWN_YAW = 1;
/** Por debajo de esta altura se considera que se cayó del escritorio (superficie en y ≈ 1.48). */
const FALL_LIMIT_Y = 1.0;

/*
 * ── Forma física ────────────────────────────────────────────────────
 *
 * - **Ruedas**: cuatro esferas del radio de las ruedas, en los centros
 *   de las mallas `wheel_*` del .glb (origen en su eje). Son las que
 *   tocan la mesa: suben sin esfuerzo los bordes de 4 mm (alfombrilla,
 *   portavasos) y chocan con lo que les llega por encima del eje
 *   (la placa del teclado, a 5,8 cm).
 * - **Carrocería**: caja ajustada a la malla, levantada del suelo.
 *
 * Sin fricción: el coche se mueve por velocidad (como el gato en
 * `Player.tsx`), así que no la necesita y no arrastra lo que pisa.
 */
const WHEELS = [
  { name: 'wheel_front_left', front: true },
  { name: 'wheel_front_right', front: true },
  { name: 'wheel_rear_left', front: false },
  { name: 'wheel_rear_right', front: false },
] as const;
const WHEEL_RADIUS = 0.2335 * S;
const CHASSIS_BOTTOM = 0.2 * S;
const CHASSIS_TOP = 0.9 * S;
const CHASSIS_HALF = [0.64 * S, (CHASSIS_TOP - CHASSIS_BOTTOM) / 2, 1.57 * S] as const;
const CHASSIS_CENTER = [0, (CHASSIS_TOP + CHASSIS_BOTTOM) / 2, -0.02 * S] as const;
/**
 * Masa ~0,1: empuja la taza o los lápices, pero no el teclado ni la
 * lámpara. Si cambias `S`, la masa varía con el cubo de la escala:
 * compénsalo aquí para que el coche empuje igual.
 */
const CHASSIS_DENSITY = 16;

/*
 * ── Conducción (modelo bicicleta) ───────────────────────────────────
 *
 * En cada paso de física: la velocidad hacia delante cambia según el
 * acelerador o el freno, el giro (yaw) es `velocidad · tan(volante) /
 * batalla`, y el deslizamiento lateral se amortigua con el agarre de
 * las ruedas (menos con el freno de mano: derrapa).
 */
/** Distancia entre ejes (centros de las ruedas en el .glb). */
const WHEELBASE = (0.936 + 0.88) * S;
/** Aceleración (m/s²): motor, marcha atrás, freno, freno de mano y rodando sin gas. */
const ACCELERATION = 2;
const REVERSE_ACCELERATION = 1.2;
const BRAKE_DECELERATION = 5;
const HANDBRAKE_DECELERATION = 3;
const ROLLING_DECELERATION = 0.6;
/** Velocidades máximas (m/s): normal, con turbo (Shift) y marcha atrás. */
const MAX_SPEED = 1.2;
const TURBO_SPEED = 2;
const MAX_REVERSE_SPEED = 0.5;
/** Por debajo de esta velocidad, S pasa de frenar a marcha atrás. */
const REVERSE_BELOW = 0.05;
/** Ángulo máximo de las ruedas delanteras parado; a más velocidad, menos. */
const MAX_STEER = 0.5;
const STEER_SPEED_FALLOFF = 0.6;
/** Rapidez con la que el volante llega al ángulo pedido. */
const STEER_RATE = 8;
/** Agarre lateral (1/s): rapidez con la que se corta el deslizamiento de lado. */
const GRIP = 14;
const HANDBRAKE_GRIP = 2;
/** Cabeceo visual (rad por m/s²): morro abajo al frenar, arriba al acelerar. */
const PITCH_PER_ACCEL = 0.012;
/** Holgura del rayo que comprueba que las ruedas tocan suelo. */
const GROUND_EPSILON = 0.02;

const UP = new THREE.Vector3(0, 1, 0);
const DOWN = { x: 0, y: -1, z: 0 };
const spawnRotation = new THREE.Quaternion().setFromAxisAngle(UP, SPAWN_YAW);

/** El cuerpo publica `kind: 'player'` para que los objetos con `knock` lo reconozcan. */
const vehicleData: PlayerUserData = { kind: 'player', vx: 0, vz: 0 };

/*
 * Las mallas del .glb se modifican fuera del componente porque el
 * compilador de React no deja mutar en `useFrame` valores devueltos por
 * un hook (`useMemo`).
 */

/** Gira una rueda sobre su eje y, si es delantera, con el volante. */
const poseWheel = (node: THREE.Object3D, spin: number, steer: number) => {
  node.rotation.x = spin;
  node.rotation.y = steer;
};

/** Enciende o apaga los pilotos de freno. */
const setBrakeLight = (material: THREE.MeshStandardMaterial, on: boolean) => {
  material.emissive.set(on ? '#ff2020' : '#000000');
  material.emissiveIntensity = on ? 2 : 0;
};

/**
 * Vehículo controlable con el teclado.
 *
 * Un cuerpo dinámico de Rapier con las rotaciones bloqueadas que se
 * conduce por velocidad, con un modelo de bicicleta. Las teclas mueven
 * el coche relativo a sí mismo:
 *
 * - **W / ↑**: acelerar. **S / ↓**: frenar y, ya parado, marcha atrás.
 * - **A D / ← →**: girar (menos ángulo cuanto más rápido).
 * - **Shift**: turbo. **Espacio**: freno de mano (frena y derrapa).
 * - **R** o caer del escritorio: vuelve a su sitio.
 *
 * Pasa por encima de lo muy bajo (alfombrilla, portavasos), choca con lo
 * voluminoso y empuja lo ligero.
 */
const DrivableVehicle = () => {
  const bodyRef = useRef<RapierRigidBody>(null);
  const modelRef = useRef<THREE.Group>(null);

  // Estado de la conducción (se actualiza en cada paso de física).
  const yaw = useRef(SPAWN_YAW);
  const steering = useRef(0);
  const speed = useRef(0);
  const acceleration = useRef(0);
  const braking = useRef(false);
  const wheelSpin = useRef(0);

  const [, getKeys] = useKeyboardControls<Control>();
  const { world, rapier } = useRapier();
  const { scene } = useGLTF(MODEL_URL);

  // Ruedas del modelo (para girarlas) y su posición de reposo.
  const wheels = useMemo(
    () =>
      WHEELS.map(({ name, front }) => {
        const node = scene.getObjectByName(name);
        if (node) node.rotation.order = 'YXZ'; // primero el volante, luego el giro sobre el eje
        return { node, front, center: node?.position.clone().multiplyScalar(S) ?? new THREE.Vector3() };
      }),
    [scene]
  );

  // Pilotos traseros propios, para encenderlos al frenar.
  const brakeLight = useMemo(() => {
    let material: THREE.MeshStandardMaterial | null = null;
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      obj.castShadow = true;
      const current = mesh.isMesh ? (mesh.material as THREE.MeshStandardMaterial) : null;
      if (current?.name === 'redLightMaterial') {
        material ??= current.clone();
        mesh.material = material;
      }
    });
    return material as THREE.MeshStandardMaterial | null;
  }, [scene]);

  useBeforePhysicsStep((physicsWorld) => {
    const body = bodyRef.current;
    if (!body) return;
    const delta = physicsWorld.timestep;
    const keys = getKeys();
    const pos = body.translation();

    if (keys.reset || pos.y < FALL_LIMIT_Y) {
      body.setTranslation(SPAWN_POSITION, true);
      body.setRotation(spawnRotation, true);
      body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      yaw.current = SPAWN_YAW;
      speed.current = 0;
      steering.current = 0;
      return;
    }

    const forward = { x: Math.sin(yaw.current), z: Math.cos(yaw.current) };
    const right = { x: -forward.z, z: forward.x };
    const vel = body.linvel();
    // Velocidad real (los choques la frenan): hacia delante y de lado.
    const forwardSpeed = vel.x * forward.x + vel.z * forward.z;
    const sideSpeed = vel.x * right.x + vel.z * right.z;

    // ¿Alguna rueda toca suelo? En el aire no hay tracción ni volante.
    const grounded = wheels.some(({ center }) => {
      const origin = {
        x: pos.x + forward.x * center.z + right.x * -center.x,
        y: pos.y + center.y,
        z: pos.z + forward.z * center.z + right.z * -center.x,
      };
      return !!world.castRay(
        new rapier.Ray(origin, DOWN),
        WHEEL_RADIUS + GROUND_EPSILON,
        true,
        undefined,
        undefined,
        undefined,
        body
      );
    });

    // Acelerador, freno y marcha atrás.
    const maxSpeed = keys.run ? TURBO_SPEED : MAX_SPEED;
    let accel = 0;
    let brakingNow = false;
    if (keys.forward && !keys.back) {
      if (forwardSpeed < -REVERSE_BELOW) {
        accel = BRAKE_DECELERATION; // venía marcha atrás: primero frena
        brakingNow = true;
      } else if (forwardSpeed < maxSpeed) accel = ACCELERATION;
    } else if (keys.back && !keys.forward) {
      if (forwardSpeed > REVERSE_BELOW) {
        accel = -BRAKE_DECELERATION;
        brakingNow = true;
      } else if (forwardSpeed > -MAX_REVERSE_SPEED) {
        accel = -REVERSE_ACCELERATION;
        brakingNow = true; // luz de marcha atrás
      }
    } else {
      accel = -Math.sign(forwardSpeed) * ROLLING_DECELERATION;
    }
    if (keys.jump) {
      accel = -Math.sign(forwardSpeed) * HANDBRAKE_DECELERATION;
      brakingNow = true;
    }
    if (!grounded) accel = 0;

    let nextSpeed = forwardSpeed + accel * delta;
    // Frenar o rodar sin gas nunca invierte el sentido.
    const slowing = Math.sign(accel) === -Math.sign(forwardSpeed);
    if (slowing && Math.sign(nextSpeed) !== Math.sign(forwardSpeed)) nextSpeed = 0;
    nextSpeed = THREE.MathUtils.clamp(nextSpeed, -MAX_REVERSE_SPEED, maxSpeed);

    // Volante y giro (modelo bicicleta).
    const turn = (keys.left ? 1 : 0) - (keys.right ? 1 : 0);
    const maxSteer = MAX_STEER / (1 + Math.abs(nextSpeed) * STEER_SPEED_FALLOFF);
    steering.current += (turn * maxSteer - steering.current) * (1 - Math.exp(-STEER_RATE * delta));
    if (grounded) yaw.current += ((nextSpeed * Math.tan(steering.current)) / WHEELBASE) * delta;
    body.setRotation(new THREE.Quaternion().setFromAxisAngle(UP, yaw.current), true);

    // Agarre: el deslizamiento lateral se corta (menos con freno de mano).
    const grip = keys.jump ? HANDBRAKE_GRIP : GRIP;
    const nextSide = grounded ? sideSpeed * Math.exp(-grip * delta) : sideSpeed;

    const newForward = { x: Math.sin(yaw.current), z: Math.cos(yaw.current) };
    const newRight = { x: -newForward.z, z: newForward.x };
    const vx = newForward.x * nextSpeed + newRight.x * nextSide;
    const vz = newForward.z * nextSpeed + newRight.z * nextSide;
    body.setLinvel({ x: grounded ? vx : vel.x, y: vel.y, z: grounded ? vz : vel.z }, true);

    speed.current = nextSpeed;
    acceleration.current = (nextSpeed - forwardSpeed) / delta;
    braking.current = brakingNow;
    vehicleData.vx = vx;
    vehicleData.vz = vz;
  });

  // Ruedas, cabeceo y pilotos de freno: sólo visual.
  useFrame((_, delta) => {
    wheelSpin.current += (speed.current / WHEEL_RADIUS) * delta;
    wheels.forEach(({ node, front }) => {
      if (node) poseWheel(node, wheelSpin.current, front ? steering.current : 0);
    });
    const model = modelRef.current;
    if (model) {
      // Morro abajo al frenar, arriba al acelerar (rotation.x negativo = morro arriba).
      const pitch = THREE.MathUtils.clamp(acceleration.current * PITCH_PER_ACCEL, -0.06, 0.06);
      model.rotation.x += (pitch - model.rotation.x) * (1 - Math.exp(-8 * delta));
    }
    if (brakeLight) setBrakeLight(brakeLight, braking.current);
  });

  const frictionless = {
    friction: 0,
    frictionCombineRule: rapier.CoefficientCombineRule.Min,
  };

  return (
    <RigidBody
      ref={bodyRef}
      type="dynamic"
      colliders={false}
      position={SPAWN_POSITION.toArray()}
      quaternion={spawnRotation.toArray()}
      userData={vehicleData}
      enabledRotations={[false, false, false]}
      ccd
    >
      <CuboidCollider
        args={[...CHASSIS_HALF]}
        position={[...CHASSIS_CENTER]}
        density={CHASSIS_DENSITY}
        {...frictionless}
      />
      {wheels.map(({ center }, i) => (
        <BallCollider
          key={WHEELS[i].name}
          args={[WHEEL_RADIUS]}
          position={center.toArray()}
          density={CHASSIS_DENSITY}
          {...frictionless}
        />
      ))}
      <group ref={modelRef}>
        <primitive object={scene} scale={S} />
      </group>
    </RigidBody>
  );
};

useGLTF.preload(MODEL_URL);

export default DrivableVehicle;
