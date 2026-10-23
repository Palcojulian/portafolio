import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useAnimations, useGLTF, useKeyboardControls } from '@react-three/drei';
import {
  CapsuleCollider,
  RigidBody,
  useBeforePhysicsStep,
  useRapier,
  type RapierRigidBody,
} from '@react-three/rapier';
import type { Control } from '../../helpers/keyboardMap';

const MODEL_URL = '/3d-models/gato.glb';

/**
 * Collider: cápsula vertical. Tiene que ser simétrica respecto a Y
 * porque el cuerpo físico no gira (sólo gira el modelo visual).
 */
const RADIUS = 0.08;
/** Media altura del tramo recto de la cápsula. */
const HALF_HEIGHT = 0.02;
/** Distancia del centro del cuerpo a los pies. */
const FEET_OFFSET = HALF_HEIGHT + RADIUS;
/** El .glb mide ~0,58 de largo y ~0,37 de alto; así queda a escala del escritorio. */
const CAT_SCALE = 1;
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

/** Segundos quieto hasta que el gato se sienta y hasta que se duerme. */
const SIT_AFTER = 8;
const SLEEP_AFTER = 20;
/** Duración de la transición entre animaciones. */
const FADE = 0.2;

/** Gravedad de `<Physics>` (App.tsx), para calcular cuánto dura el salto. */
const GRAVITY = 9.81;
/**
 * Fases del clip `Jump` (segundos): 0 → despegue es la preparación,
 * despegue → aterrizaje el vuelo, y el resto la recuperación. El salto
 * físico es inmediato, así que el clip empieza en el despegue y se
 * acelera para que el vuelo dure lo mismo que en la simulación.
 */
const JUMP_TAKEOFF = 0.42;
const JUMP_LANDING = 1.0;
const JUMP_TIME_SCALE = (JUMP_LANDING - JUMP_TAKEOFF) / ((2 * JUMP_SPEED) / GRAVITY);

type CatAnimation = 'Idle' | 'Walk' | 'Sit' | 'Sleep' | 'Jump';

/**
 * El clip `Jump` se reproduce una vez y, al terminar, se queda en su
 * última pose (la de reposo) para fundirse desde ahí con la siguiente.
 *
 * Fuera del componente porque el compilador de React no deja asignar
 * propiedades a objetos devueltos por un hook (`useAnimations`).
 */
const setupJump = (jump: THREE.AnimationAction) => {
  jump.setLoop(THREE.LoopOnce, 1);
  jump.clampWhenFinished = true;
  jump.timeScale = JUMP_TIME_SCALE;
};

/** Arranca el clip `Jump` en el despegue (se salta la preparación). */
const startJump = (jump: THREE.AnimationAction) => {
  jump.reset().fadeIn(FADE / 2).play();
  jump.time = JUMP_TAKEOFF;
};

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
 * Personaje controlable con el teclado: el gato.
 *
 * Un cuerpo dinámico de Rapier (cápsula) con la rotación bloqueada que
 * se desplaza por el escritorio y empuja los objetos dinámicos al
 * chocar con ellos. El modelo animado (`gato.glb`) gira hacia donde
 * avanza.
 *
 * - **Movimiento** relativo a la cámara: "adelante" es siempre la
 *   dirección hacia la que mira la cámara, proyectada en el plano XZ.
 * - **Velocidad**: se interpola la velocidad horizontal hacia la
 *   deseada y se conserva la vertical (gravedad / salto).
 * - **Salto**: sólo si un rayo corto hacia abajo detecta suelo.
 * - **Reset**: con la tecla R o automáticamente al caer del escritorio.
 * - **Animación**: `Walk` al moverse (más rápida al correr), `Jump` al
 *   saltar, `Idle` parado y, si sigue quieto, `Sit` y luego `Sleep`.
 *
 * `userData.kind = 'player'` permite a los objetos con `knock`
 * reconocerlo y volcarse al recibir el golpe (`usePlayerKnock`).
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
  const running = useRef(false);
  const jumped = useRef(false);
  const modelRef = useRef<THREE.Group>(null);

  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions } = useAnimations(animations, visualRef);
  const current = useRef<CatAnimation>('Idle');
  const idleTime = useRef(0);

  // `torso` es el hueso raíz del cuerpo; su Z local es la altura (el
  // .glb viene de Blender, con Z arriba). El clip `Jump` lo eleva, pero
  // la altura ya la pone la física: se compensa en `useFrame`.
  const torso = scene.getObjectByName('torso');
  const torsoRestZ = useRef(torso?.position.z ?? 0);

  useEffect(() => {
    scene.traverse((obj) => {
      obj.castShadow = true;
    });
  }, [scene]);

  useEffect(() => {
    actions.Idle?.reset().play();
    if (actions.Jump) setupJump(actions.Jump);
  }, [actions]);

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

    running.current = keys.run;
    const speed = keys.run ? RUN_SPEED : WALK_SPEED;
    const vel = body.linvel();
    const t = 1 - Math.exp(-ACCELERATION * delta);
    let vy = vel.y;

    // Salto: sólo al pulsar (no manteniendo) y con suelo debajo.
    if (keys.jump && !jumpHeld.current) {
      const ray = new rapier.Ray(pos, { x: 0, y: -1, z: 0 });
      const hit = world.castRay(
        ray,
        FEET_OFFSET + GROUND_EPSILON,
        true,
        undefined,
        undefined,
        undefined,
        body
      );
      if (hit) {
        vy = JUMP_SPEED;
        jumped.current = true;
      }
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

  // Orientar el cuerpo visual hacia donde avanza y elegir la animación
  // (sólo visual: por fotograma).
  useFrame((_, delta) => {
    const jump = actions.Jump;
    const jumping = current.current === 'Jump' && !!jump?.isRunning();
    idleTime.current = moving.current || jumping ? 0 : idleTime.current + delta;

    if (jumped.current && jump) {
      // Se reinicia también si salta de nuevo nada más aterrizar.
      jumped.current = false;
      if (current.current !== 'Jump') actions[current.current]?.fadeOut(FADE / 2);
      startJump(jump);
      current.current = 'Jump';
    } else if (!jumping) {
      const next: CatAnimation = moving.current
        ? 'Walk'
        : idleTime.current > SLEEP_AFTER
          ? 'Sleep'
          : idleTime.current > SIT_AFTER
            ? 'Sit'
            : 'Idle';
      if (next !== current.current) {
        actions[current.current]?.fadeOut(FADE);
        actions[next]?.reset().fadeIn(FADE).play();
        current.current = next;
      }
    }
    actions.Walk?.setEffectiveTimeScale(running.current ? RUN_SPEED / WALK_SPEED : 1);

    // Anula la elevación del torso que añade el clip `Jump`. Sólo la
    // subida: al aterrizar se agacha con las patas apoyadas, y compensar
    // esa bajada lo haría flotar.
    const model = modelRef.current;
    if (model && torso && jump) {
      const rise = Math.max(0, torso.position.z - torsoRestZ.current);
      const lift = rise * jump.getEffectiveWeight();
      model.position.y = -FEET_OFFSET - lift * CAT_SCALE;
    }

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
      <CapsuleCollider args={[HALF_HEIGHT, RADIUS]} density={3} friction={0.6} />
      <group ref={visualRef}>
        {/* Pies del modelo (y = 0 en el .glb) en la base de la cápsula; mira a +Z */}
        <group ref={modelRef} position-y={-FEET_OFFSET}>
          <primitive object={scene} scale={CAT_SCALE} />
        </group>
      </group>
    </RigidBody>
  );
};

useGLTF.preload(MODEL_URL);

export default Player;
