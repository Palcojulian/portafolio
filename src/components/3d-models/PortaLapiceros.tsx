import { useRef, useState } from 'react';
import { Euler, Quaternion, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import {
  CapsuleCollider,
  CuboidCollider,
  CylinderCollider,
  type RapierRigidBody,
} from '@react-three/rapier';
import AutoGLTF from '../physics/AutoGLTF';
import RigidObject from '../physics/RigidObject';
import Lapiz, { LapizVisual } from './Lapiz';
import {
  PENCIL_CENTER_Y,
  PENCIL_HALF_HEIGHT,
  PENCIL_RADIUS,
  PENCIL_SCALE,
  PENCIL_SOLVER_ITERATIONS,
} from './lapizShape';
import type { NombrePaleta } from '../../helpers/paleta-colores';

type Vec3 = [number, number, number];

const HOLDER_POSITION: Vec3 = [-2, 1.48, -0.4];

/*
 * Medidas de la malla (rejilla), escala 1: alto 0.312 y pared entre
 * r ≈ 0.1265 y 0.1433.
 * - Por fuera, el collider coincide con la malla: si sobresale, el
 *   portalápices tumbado y lo que se apoya en él "levitan".
 * - Por dentro es más grueso que la rejilla (3.1 cm, más que el
 *   diámetro del lápiz, 2.7 cm). Con una pared más fina que el lápiz,
 *   al quedar uno aplastado (p. ej. el portalápices tumbado encima),
 *   Rapier lo resolvía empujándolo a través de la pared.
 */
const HEIGHT = 0.312;
const BOTTOM_HALF = 0.006;
/** 16 segmentos: con menos, las esquinas del polígono sobresalen de la malla. */
const WALL_SEGMENTS = 16;
/** Apotema interior y exterior del polígono de la pared. */
const WALL_INNER = 0.11;
const WALL_OUTER = 0.141;
const WALL_RADIUS = (WALL_INNER + WALL_OUTER) / 2;
const WALL_HALF_THICKNESS = (WALL_OUTER - WALL_INNER) / 2;
/** Semiancho de cada segmento (cubre su lado por fuera, con un pequeño solape). */
const WALL_HALF_WIDTH = WALL_OUTER * Math.tan(Math.PI / WALL_SEGMENTS) + 0.003;
/**
 * Fricción del fondo: alta, para que al empujarlo pivote sobre el borde
 * de la base en vez de deslizarse. Su radio es el exterior, así que ese
 * borde es el punto de apoyo al volcar.
 */
const BOTTOM_FRICTION = 3;
/**
 * Fricción de las paredes. Rapier promedia las de los dos colliders:
 * con los lápices (fricción 0) queda en 0.5, así que resbalan fuera al
 * volcar; contra la mesa es mayor y, tumbado, no patina lejos.
 */
const WALL_FRICTION = 1;

/** Impulso de vuelco por m/s del personaje (ver `usePlayerKnock`). */
const KNOCK = 0.003;
/**
 * Inclinación a partir de la cual se sueltan los lápices: el
 * portalápices ya está volcando y la boca mira hacia un lado.
 */
const RELEASE_COS = Math.cos((35 * Math.PI) / 180);
/**
 * Velocidad (m/s) con la que los lápices salen hacia la boca al
 * soltarse, como por la inercia del vuelco. Sin ella, con el
 * portalápices tumbado nada los empuja a lo largo del tubo y se quedaban
 * dentro, apoyados en la cara interior de la pared (más gruesa que la
 * rejilla), es decir, "levitando" sobre la malla visible.
 */
const POUR_SPEED = 0.4;

const walls = Array.from({ length: WALL_SEGMENTS }, (_, i) => {
  const angle = (i / WALL_SEGMENTS) * Math.PI * 2;
  return {
    position: [Math.sin(angle) * WALL_RADIUS, HEIGHT / 2, Math.cos(angle) * WALL_RADIUS] as Vec3,
    rotation: [0, angle, 0] as Vec3,
  };
});

/** Inclinación (rad) de los lápices hacia la pared. */
const PENCIL_TILT = 0.12;
/**
 * Distancia al centro de los lápices (en las diagonales). Inclinados,
 * a la altura del borde quedan a ≈ 0.101 del eje: dentro de la pared.
 */
const PENCIL_OFFSET = 0.05;

/**
 * Lápices dentro del portalápices, apoyados en el fondo e inclinados
 * hacia fuera. `angle` (grados) es su dirección vista desde arriba
 * (0 = +Z). Transformación **local** respecto al portalápices.
 */
const pencils = (
  [
    [225, 'amarillos'],
    [135, 'rojos'],
    [315, 'azulGrisOscuro'],
    [45, 'verdes'],
  ] as [number, NombrePaleta][]
).map(([angle, paleta]) => {
  const rad = (angle * Math.PI) / 180;
  const dx = Math.sin(rad);
  const dz = Math.cos(rad);
  // Girar sobre X inclina hacia +Z y sobre Z hacia −X: hacia fuera.
  const rotation: Vec3 = [dz * PENCIL_TILT, 0, -dx * PENCIL_TILT];
  return {
    paleta,
    position: new Vector3(dx * PENCIL_OFFSET, BOTTOM_HALF * 2 + 0.001, dz * PENCIL_OFFSET),
    rotation,
    quaternion: new Quaternion().setFromEuler(new Euler(...rotation)),
  };
});

interface LapizLiberado {
  paleta: NombrePaleta;
  position: Vec3;
  quaternion: [number, number, number, number];
  linearVelocity: Vec3;
  angularVelocity: Vec3;
}

/**
 * Portalápices con sus 4 lápices. Cuerpo físico dinámico **hueco**.
 *
 * Collider compuesto ajustado a la malla: fondo cilíndrico y pared de
 * `WALL_SEGMENTS` cajas finas en anillo (un collider automático sería
 * una caja maciza).
 *
 * **Lápices pegados hasta que vuelca.** Mientras está de pie, los
 * lápices forman parte de su cuerpo rígido (sus cápsulas son colliders
 * del portalápices). Sueltos dentro del tubo, el golpe del personaje
 * hacía girar las paredes tan rápido que los barrían en un paso, o el
 * personaje los aplastaba contra ellas, y quedaban incrustados. Al pasar
 * de 35° de inclinación (o al chocar con el suelo) se sustituyen por
 * lápices dinámicos con la misma pose y velocidad, más un empujón hacia
 * la boca (`POUR_SPEED`), y salen por ella.
 *
 * El .glb tiene una única malla (`portaLapiceros`) y un material
 * `Material`.
 */
const Model = () => {
  const bodyRef = useRef<RapierRigidBody>(null);
  const releasedRef = useRef(false);
  const [released, setReleased] = useState<LapizLiberado[] | null>(null);

  const release = () => {
    const body = bodyRef.current;
    if (releasedRef.current || !body) return;
    releasedRef.current = true;

    const t = body.translation();
    const r = body.rotation();
    const com = body.worldCom();
    const lv = body.linvel();
    const av = body.angvel();
    const origin = new Vector3(t.x, t.y, t.z);
    const rotation = new Quaternion(r.x, r.y, r.z, r.w);
    const angular = new Vector3(av.x, av.y, av.z);
    const mouth = new Vector3(0, POUR_SPEED, 0).applyQuaternion(rotation);

    setReleased(
      pencils.map((p) => {
        const position = p.position.clone().applyQuaternion(rotation).add(origin);
        // Velocidad del punto: v_cm + ω × (p − cm).
        const velocity = angular
          .clone()
          .cross(position.clone().sub(new Vector3(com.x, com.y, com.z)))
          .add(new Vector3(lv.x, lv.y, lv.z))
          .add(mouth);
        const quaternion = rotation.clone().multiply(p.quaternion);
        return {
          paleta: p.paleta,
          position: position.toArray(),
          quaternion: [quaternion.x, quaternion.y, quaternion.z, quaternion.w],
          linearVelocity: velocity.toArray(),
          angularVelocity: angular.toArray(),
        };
      })
    );
  };

  useFrame(() => {
    const body = bodyRef.current;
    if (releasedRef.current || !body) return;
    const q = body.rotation();
    // Componente Y del eje Y local (1 = de pie).
    if (1 - 2 * (q.x * q.x + q.z * q.z) < RELEASE_COS) release();
  });

  return (
    <>
      <RigidObject
        type="dynamic"
        sound="metal"
        colliders={false}
        ccd
        additionalSolverIterations={PENCIL_SOLVER_ITERATIONS}
        knock={KNOCK}
        bodyRef={bodyRef}
        onFloorImpact={release}
        position={HOLDER_POSITION}
      >
        <AutoGLTF url="/3d-models/porta-lapiceros.glb" />
        <CylinderCollider
          args={[BOTTOM_HALF, WALL_OUTER]}
          position={[0, BOTTOM_HALF, 0]}
          friction={BOTTOM_FRICTION}
        />
        {walls.map((w, i) => (
          <CuboidCollider
            key={i}
            args={[WALL_HALF_WIDTH, HEIGHT / 2, WALL_HALF_THICKNESS]}
            position={w.position}
            rotation={w.rotation}
            friction={WALL_FRICTION}
          />
        ))}

        {/* Lápices pegados: grupo sin escala para la cápsula (medidas ya
            escaladas) y grupo escalado sólo para las mallas. */}
        {!released &&
          pencils.map((p) => (
            <group key={p.paleta} position={p.position} rotation={p.rotation}>
              <CapsuleCollider
                args={[PENCIL_HALF_HEIGHT, PENCIL_RADIUS]}
                position={[0, PENCIL_CENTER_Y, 0]}
                friction={0}
              />
              <group scale={PENCIL_SCALE}>
                <LapizVisual paleta={p.paleta} intensidad={500} />
              </group>
            </group>
          ))}
      </RigidObject>

      {released?.map((p) => (
        <Lapiz
          key={p.paleta}
          paleta={p.paleta}
          intensidad={500}
          position={p.position}
          quaternion={p.quaternion}
          linearVelocity={p.linearVelocity}
          angularVelocity={p.angularVelocity}
        />
      ))}
    </>
  );
};

useGLTF.preload('/3d-models/porta-lapiceros.glb');

export default Model;
