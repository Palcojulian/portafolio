import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import {
  BallCollider,
  RigidBody,
  useBeforePhysicsStep,
  useRapier,
  type RapierRigidBody,
} from '@react-three/rapier';
import { amarillos, azulGrisOscuro } from '../../helpers/paleta-colores';
import type { Control } from './keyboardMap';

/** Radio del collider (y de la esfera visual). */
const RADIUS = 0.09;
/** Punto de aparición: zona libre del escritorio, delante a la izquierda del teclado. */
const SPAWN = new THREE.Vector3(-0.7, 1.7, 0.6);
/** Por debajo de esta altura se considera que se cayó del escritorio (superficie en y ≈ 1.48). */
const FALL_LIMIT_Y = 1.0;

const WALK_SPEED = 1.2;
const RUN_SPEED = 2.2;
/** Cuanto mayor, antes alcanza la velocidad deseada (aceleración/frenado). */
const ACCELERATION = 12;
const JUMP_SPEED = 2.6;
/** Holgura del rayo de suelo por debajo de la esfera. */
const GROUND_EPSILON = 0.03;
/** Velocidad de giro del cuerpo visual hacia la dirección de avance. */
const TURN_SPEED = 12;

const UP = new THREE.Vector3(0, 1, 0);

/**
 * `userData` del RigidBody del personaje. `vx`/`vz` es la velocidad
 * horizontal que el personaje **intenta** llevar en este paso; los
 * objetos la leen al chocar (`usePlayerKnock`), porque tras el choque
 * su velocidad real ya está frenada por el contacto.
 */
export interface PlayerUserData {
  kind: 'player';
  vx: number;
  vz: number;
}

const playerData: PlayerUserData = { kind: 'player', vx: 0, vz: 0 };

/**
 * Personaje controlable con el teclado.
 *
 * Es el marcador de posición del futuro gato: una esfera dinámica de
 * Rapier con la rotación bloqueada que se desplaza por el escritorio y
 * empuja los objetos dinámicos al chocar con ellos.
 *
 * - **Movimiento** relativo a la cámara: "adelante" es siempre la
 *   dirección hacia la que mira la cámara, proyectada en el plano XZ.
 * - **Velocidad**: se interpola la velocidad horizontal hacia la
 *   deseada y se conserva la vertical (gravedad / salto).
 * - **Salto**: sólo si un rayo corto hacia abajo detecta suelo.
 * - **Reset**: con la tecla R o automáticamente al caer del escritorio.
 *
 * `userData.kind = 'player'` permite a los objetos con `knock`
 * reconocerlo y volcarse al recibir el golpe (`usePlayerKnock`).
 *
 * Para sustituirlo por el gato basta con cambiar el contenido del
 * `<group ref={visualRef}>` (y el collider, p. ej. un `CapsuleCollider`).
 */
const Player = () => {
  const bodyRef = useRef<RapierRigidBody>(null);
  const visualRef = useRef<THREE.Group>(null);
  const jumpHeld = useRef(false);

  const [, getKeys] = useKeyboardControls<Control>();
  const { world, rapier } = useRapier();

  const camera = useThree((s) => s.camera);
  const forward = useRef(new THREE.Vector3());
  const right = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const moving = useRef(false);

  // El control va en cada paso de física (no en cada fotograma): así el
  // empuje sobre otros objetos no depende de los FPS. Con pocos FPS hay
  // varios pasos por fotograma y, si la velocidad sólo se fijara una vez
  // por fotograma, el contacto la frenaría entre medias.
  useBeforePhysicsStep((physicsWorld) => {
    const body = bodyRef.current;
    if (!body) return;
    const delta = physicsWorld.timestep;

    const keys = getKeys();
    const pos = body.translation();

    if (keys.reset || pos.y < FALL_LIMIT_Y) {
      body.setTranslation(SPAWN, true);
      body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      return;
    }

    // Ejes de movimiento a partir de la cámara (sólo plano XZ).
    camera.getWorldDirection(forward.current);
    forward.current.y = 0;
    forward.current.normalize();
    right.current.crossVectors(forward.current, UP);

    const dir = direction.current.set(0, 0, 0);
    if (keys.forward) dir.add(forward.current);
    if (keys.back) dir.sub(forward.current);
    if (keys.right) dir.add(right.current);
    if (keys.left) dir.sub(right.current);
    moving.current = dir.lengthSq() > 0;
    if (moving.current) dir.normalize();

    const speed = keys.run ? RUN_SPEED : WALK_SPEED;
    const vel = body.linvel();
    const t = 1 - Math.exp(-ACCELERATION * delta);
    let vy = vel.y;

    // Salto: sólo al pulsar (no manteniendo) y con suelo debajo.
    if (keys.jump && !jumpHeld.current) {
      const ray = new rapier.Ray(pos, { x: 0, y: -1, z: 0 });
      const hit = world.castRay(
        ray,
        RADIUS + GROUND_EPSILON,
        true,
        undefined,
        undefined,
        undefined,
        body
      );
      if (hit) vy = JUMP_SPEED;
    }
    jumpHeld.current = keys.jump;

    playerData.vx = dir.x * speed;
    playerData.vz = dir.z * speed;

    body.setLinvel(
      {
        x: THREE.MathUtils.lerp(vel.x, dir.x * speed, t),
        y: vy,
        z: THREE.MathUtils.lerp(vel.z, dir.z * speed, t),
      },
      true
    );
  });

  // Orientar el cuerpo visual hacia donde avanza (sólo visual: por fotograma).
  useFrame((_, delta) => {
    const visual = visualRef.current;
    if (visual && moving.current) {
      const dir = direction.current;
      const target = Math.atan2(dir.x, dir.z);
      const diff = Math.atan2(
        Math.sin(target - visual.rotation.y),
        Math.cos(target - visual.rotation.y)
      );
      visual.rotation.y += diff * (1 - Math.exp(-TURN_SPEED * delta));
    }
  });

  return (
    <RigidBody
      ref={bodyRef}
      type="dynamic"
      colliders={false}
      position={SPAWN.toArray()}
      userData={playerData}
      enabledRotations={[false, false, false]}
      linearDamping={0.5}
      ccd
    >
      <BallCollider args={[RADIUS]} density={3} friction={0.6} />
      <group ref={visualRef}>
        {/* Cuerpo */}
        <mesh castShadow>
          <sphereGeometry args={[RADIUS, 32, 32]} />
          <meshStandardMaterial color={amarillos[500]} roughness={0.5} />
        </mesh>
        {/* "Nariz": indica hacia dónde mira (+Z local) */}
        <mesh castShadow position={[0, RADIUS * 0.2, RADIUS * 0.95]}>
          <sphereGeometry args={[RADIUS * 0.25, 16, 16]} />
          <meshStandardMaterial color={azulGrisOscuro[500]} roughness={0.6} />
        </mesh>
      </group>
    </RigidBody>
  );
};

export default Player;
