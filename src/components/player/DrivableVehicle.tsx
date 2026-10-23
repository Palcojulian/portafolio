import { useEffect, useMemo, useRef } from 'react';
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
import type { Control } from '../../helpers/keyboardMap';
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

/*
 * ── Luces ───────────────────────────────────────────────────────────
 *
 * Cada luz del .glb es un nodo propio (separados en Blender) con su
 * material clonado, para encenderlos por separado con `emissive`:
 *
 * - **Faros** (`headlights`, L): además de brillar, dos `spotLight`
 *   iluminan la mesa por delante del coche.
 * - **Pilotos** (`taillight_*`): tenues con los faros encendidos y
 *   fuertes al frenar (S en marcha, W en marcha atrás o Espacio), con
 *   un `pointLight` rojo que tiñe la mesa por detrás.
 * - **Direccionales** (`indicator_*` delante y el piloto del mismo lado
 *   detrás, Q / E) y **estacionarias** (X, los dos lados): parpadean en
 *   ámbar.
 *
 * Las luces de three.js están siempre montadas y sólo cambia su
 * intensidad: añadirlas o quitarlas obligaría a recompilar los shaders.
 */
const LIGHT_NODES = {
  head: 'headlights',
  indicatorLeft: 'indicator_left',
  indicatorRight: 'indicator_right',
  tailLeft: 'taillight_left',
  tailRight: 'taillight_right',
} as const;
type LightPart = keyof typeof LIGHT_NODES;
type LightMaterials = Partial<Record<LightPart, THREE.MeshStandardMaterial>>;

const HEADLIGHT_COLOR = '#fff1d0';
const BRAKE_COLOR = '#ff1818';
const AMBER = '#ff8c10';
/** Brillo (`emissiveIntensity`) de cada estado. */
const HEAD_GLOW = 4;
const TAIL_GLOW = 0.8;
const BRAKE_GLOW = 4;
const SIGNAL_GLOW = 2;
/** Intensidad de los focos de los faros y del resplandor de freno (candelas). */
const HEADLIGHT_INTENSITY = 4;
const BRAKE_LIGHT_INTENSITY = 0.06;
/** Periodo del parpadeo de direccionales y estacionarias (s). */
const BLINK_PERIOD = 0.7;

/**
 * Posición de los focos (escala 1, coche mirando a +Z): justo por
 * delante de los faros y por detrás de los pilotos, fuera de la
 * carrocería. Si estuvieran dentro, la sombra del propio coche los
 * taparía.
 */
const HEADLIGHT_SPOTS = [0.45, -0.45].map((x) => [x * S, 0.47 * S, 1.66 * S] as const);
const BRAKE_GLOW_POSITION = [0, 0.48 * S, -1.62 * S] as const;
/** Los faros apuntan a la mesa, `HEADLIGHT_REACH` por delante; el freno, detrás. */
const HEADLIGHT_REACH = 0.5;
const BRAKE_GLOW_REACH = 0.25;
/**
 * Sombras de las luces del coche: los objetos que iluminan tapan la luz
 * (no la atraviesa). Sólo se recalculan con la luz encendida
 * (`shadow.autoUpdate`), así que apagadas no cuestan nada.
 */
const SHADOW_MAP_SIZE = 512;
const SHADOW_BIAS = -0.0004;
const SHADOW_NORMAL_BIAS = 0.004;

type Signal = 'off' | 'left' | 'right';

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

/** Hace brillar (o apaga) el material de una luz. */
const glow = (material: THREE.MeshStandardMaterial | undefined, color: string, intensity: number) => {
  if (!material) return;
  material.emissive.set(intensity > 0 ? color : '#000000');
  material.emissiveIntensity = intensity;
};

/**
 * Enciende o apaga un foco del coche; su sombra sólo se recalcula
 * encendido. El mapa de sombras se dibuja al menos una vez aunque esté
 * apagado: si no existe, el shader se queda sin textura y WebGL falla
 * (INVALID_OPERATION) y pinta el fotograma en blanco.
 */
const setSpot = (light: THREE.SpotLight | null, intensity: number) => {
  if (!light) return;
  light.intensity = intensity;
  light.shadow.autoUpdate = intensity > 0;
  if (!light.shadow.map) light.shadow.needsUpdate = true;
};

/** Estado de todas las luces del coche en este fotograma. */
const applyLights = (
  materials: LightMaterials,
  state: { headlights: boolean; braking: boolean; blinkLeft: boolean; blinkRight: boolean }
) => {
  const tail = state.braking ? BRAKE_GLOW : state.headlights ? TAIL_GLOW : 0;
  glow(materials.head, HEADLIGHT_COLOR, state.headlights ? HEAD_GLOW : 0);
  glow(materials.indicatorLeft, AMBER, state.blinkLeft ? SIGNAL_GLOW : 0);
  glow(materials.indicatorRight, AMBER, state.blinkRight ? SIGNAL_GLOW : 0);
  // Detrás, el direccional usa el piloto de su lado: ámbar mientras parpadea.
  if (state.blinkLeft) glow(materials.tailLeft, AMBER, SIGNAL_GLOW);
  else glow(materials.tailLeft, BRAKE_COLOR, tail);
  if (state.blinkRight) glow(materials.tailRight, AMBER, SIGNAL_GLOW);
  else glow(materials.tailRight, BRAKE_COLOR, tail);
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
 * - **L** faros, **Q / E** direccionales, **X** estacionarias.
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

  // Luces que se encienden con el teclado (cada pulsación cambia el estado).
  const headlightsOn = useRef(false);
  const signal = useRef<Signal>('off');
  const hazardsOn = useRef(false);
  const blinkClock = useRef(0);
  const headlightRefs = useRef<(THREE.SpotLight | null)[]>([]);
  const brakeGlowRef = useRef<THREE.SpotLight>(null);

  const [subscribeKeys, getKeys] = useKeyboardControls<Control>();
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

  // Un material propio por luz, para encender cada una por separado.
  //
  // Se clona una sola vez y se guarda en la propia malla: en StrictMode,
  // React 19 ejecuta este `useMemo` dos veces y se queda con el primer
  // resultado. Si se clonara en cada llamada, la malla acabaría con el
  // material de la segunda y se encendería otro distinto.
  const lightMaterials = useMemo(() => {
    const materials: LightMaterials = {};
    scene.traverse((obj) => {
      obj.castShadow = true;
    });
    (Object.keys(LIGHT_NODES) as LightPart[]).forEach((part) => {
      const mesh = scene.getObjectByName(LIGHT_NODES[part]) as THREE.Mesh | undefined;
      if (!mesh?.isMesh) return;
      if (!mesh.userData.lightMaterial) {
        mesh.userData.lightMaterial = (mesh.material as THREE.MeshStandardMaterial).clone();
        mesh.material = mesh.userData.lightMaterial;
      }
      mesh.castShadow = false;
      materials[part] = mesh.userData.lightMaterial;
    });
    return materials;
  }, [scene]);

  // Punto al que apunta cada faro (por delante del coche, sobre la mesa)
  // y el resplandor de freno (detrás).
  const headlightTargets = useMemo(
    () =>
      HEADLIGHT_SPOTS.map(([x, , z]) => {
        const target = new THREE.Object3D();
        target.position.set(x, 0, z + HEADLIGHT_REACH);
        return target;
      }),
    []
  );
  const brakeGlowTarget = useMemo(() => {
    const target = new THREE.Object3D();
    target.position.set(0, 0, BRAKE_GLOW_POSITION[2] - BRAKE_GLOW_REACH);
    return target;
  }, []);

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

  // Teclas de luces: cambian el estado al pulsarlas. Se escucha el evento
  // de la tecla (no se consulta en cada fotograma), así una pulsación
  // rápida no se pierde aunque haya pocos FPS.
  useEffect(() => {
    const onPress = (control: Control, toggle: () => void) =>
      subscribeKeys(
        (state) => state[control],
        (down) => {
          if (down) toggle();
        }
      );
    const unsubscribe = [
      onPress('headlights', () => (headlightsOn.current = !headlightsOn.current)),
      onPress('signalLeft', () => (signal.current = signal.current === 'left' ? 'off' : 'left')),
      onPress('signalRight', () => (signal.current = signal.current === 'right' ? 'off' : 'right')),
      onPress('hazards', () => (hazardsOn.current = !hazardsOn.current)),
    ];
    return () => unsubscribe.forEach((stop) => stop());
  }, [subscribeKeys]);

  // Ruedas, cabeceo y luces: sólo visual.
  useFrame((_, delta) => {
    const blinking = hazardsOn.current || signal.current !== 'off';
    blinkClock.current = blinking ? blinkClock.current + delta : 0;
    const blinkOn = blinking && blinkClock.current % BLINK_PERIOD < BLINK_PERIOD / 2;
    const left = blinkOn && (hazardsOn.current || signal.current === 'left');
    const right = blinkOn && (hazardsOn.current || signal.current === 'right');
    applyLights(lightMaterials, {
      headlights: headlightsOn.current,
      braking: braking.current,
      blinkLeft: left,
      blinkRight: right,
    });
    headlightRefs.current.forEach((light) => setSpot(light, headlightsOn.current ? HEADLIGHT_INTENSITY : 0));
    setSpot(brakeGlowRef.current, braking.current ? BRAKE_LIGHT_INTENSITY : 0);

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
        {/* Faros: focos hacia la mesa (apagados con intensidad 0) */}
        {HEADLIGHT_SPOTS.map((position, i) => (
          <group key={i}>
            <primitive object={headlightTargets[i]} />
            <spotLight
              ref={(light) => {
                headlightRefs.current[i] = light;
              }}
              position={[...position]}
              target={headlightTargets[i]}
              color={HEADLIGHT_COLOR}
              intensity={0}
              angle={0.6}
              penumbra={0.7}
              distance={1.5}
              decay={2}
              castShadow
              shadow-mapSize-width={SHADOW_MAP_SIZE}
              shadow-mapSize-height={SHADOW_MAP_SIZE}
              shadow-camera-near={0.01}
              shadow-camera-far={1.5}
              shadow-bias={SHADOW_BIAS}
              shadow-normalBias={SHADOW_NORMAL_BIAS}
            />
          </group>
        ))}
        {/* Resplandor rojo sobre la mesa al frenar (foco hacia atrás y abajo) */}
        <primitive object={brakeGlowTarget} />
        <spotLight
          ref={brakeGlowRef}
          position={[...BRAKE_GLOW_POSITION]}
          target={brakeGlowTarget}
          color={BRAKE_COLOR}
          intensity={0}
          angle={1.1}
          penumbra={0.9}
          distance={0.6}
          decay={2}
          castShadow
          shadow-mapSize-width={SHADOW_MAP_SIZE}
          shadow-mapSize-height={SHADOW_MAP_SIZE}
          shadow-camera-near={0.01}
          shadow-camera-far={0.6}
          shadow-bias={SHADOW_BIAS}
          shadow-normalBias={SHADOW_NORMAL_BIAS}
        />
      </group>
    </RigidBody>
  );
};

useGLTF.preload(MODEL_URL);

export default DrivableVehicle;
