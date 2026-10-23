import { RigidBody } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import { useRef, type ReactNode, type RefObject } from 'react';
import { useFloorImpact, type FloorImpact } from '../../hooks/useFloorImpact';
import { usePlayerKnock } from '../../hooks/usePlayerKnock';
import type { CollisionEnterPayload } from '@react-three/rapier';
import type { SoundMaterial } from '../../audio/sound';

/**
 * Wrapper que convierte un modelo 3D en un cuerpo físico de Rapier.
 *
 * Sustituye al `<group>` tradicional: aplica position, rotation y scale
 * al RigidBody en lugar del group, y permite que el objeto participe
 * en la simulación de físicas.
 *
 * - **type="fixed"**: el objeto no se mueve. Útil para superficies como
 *   el escritorio, el monitor, el mausePad y el portaVasos.
 * - **type="dynamic"**: el objeto cae por gravedad y colisiona con
 *   otros. El visitante no lo manipula directamente: sólo el personaje
 *   (`Player`) puede moverlo al empujarlo.
 *
 * Colliders:
 * - `cuboid` (por defecto): una caja que envuelve todo el modelo. Es
 *   la opción más eficiente y predecible. Funciona bien incluso cuando
 *   el modelo tiene muchas mallas (como el teclado con 102 teclas).
 * - `hull`: forma envolvente más fiel pero potencialmente más lenta con
 *   modelos complejos.
 * - `ball`: esfera envolvente (no usada en este proyecto).
 * - `false`: sin collider automático; los colliders se pasan como hijos
 *   (`CuboidCollider`, `CylinderCollider`…). Útil para formas huecas
 *   como el portalápices.
 *
 * Sonido e impactos (sólo objetos `dynamic`):
 * - `sound`: material con el que suena al golpear el suelo.
 * - `onFloorImpact`: callback con la velocidad del golpe (p. ej. para
 *   romper la taza). Ver `useFloorImpact`.
 *
 * Volcado: con `knock`, el personaje lo vuelca al chocar con él (ver
 * `usePlayerKnock`).
 */
interface RigidObjectProps {
  type?: 'fixed' | 'dynamic';
  colliders?: 'cuboid' | 'hull' | 'ball' | false;
  position?: [number, number, number];
  rotation?: [number, number, number];
  /** Alternativa a `rotation`. */
  quaternion?: [number, number, number, number];
  scale?: number | [number, number, number];
  /** Velocidades iniciales. */
  linearVelocity?: [number, number, number];
  angularVelocity?: [number, number, number];
  /** Ref externo al cuerpo, para leer su pose o velocidad desde fuera. */
  bodyRef?: RefObject<RapierRigidBody | null>;
  /** Detección continua de colisiones (objetos finos o rápidos). */
  ccd?: boolean;
  /**
   * Iteraciones extra del solver para los contactos de este cuerpo:
   * reduce penetraciones cuando objetos finos quedan apretados.
   */
  additionalSolverIterations?: number;
  /**
   * Densidad de los colliders automáticos (por defecto 1). Más alta =
   * más pesado: el vehículo no lo puede empujar.
   */
  density?: number;
  /** Impulso de vuelco al chocar el personaje (por m/s). Ver `usePlayerKnock`. */
  knock?: number;
  sound?: SoundMaterial;
  onFloorImpact?: (impact: FloorImpact) => void;
  children: ReactNode;
}

const RigidObject = ({
  type = 'dynamic',
  colliders = 'cuboid',
  position,
  rotation,
  quaternion,
  scale,
  linearVelocity,
  angularVelocity,
  bodyRef: externalBodyRef,
  ccd,
  additionalSolverIterations,
  density,
  knock,
  sound,
  onFloorImpact,
  children,
}: RigidObjectProps) => {
  const internalBodyRef = useRef<RapierRigidBody>(null);
  const bodyRef = externalBodyRef ?? internalBodyRef;

  const onFloorCollision = useFloorImpact({
    bodyRef,
    enabled: type === 'dynamic' && (!!sound || !!onFloorImpact),
    sound,
    onFloorImpact,
  });
  const onKnockCollision = usePlayerKnock({
    bodyRef,
    strength: type === 'dynamic' ? knock : undefined,
  });
  const onCollisionEnter =
    onFloorCollision || onKnockCollision
      ? (e: CollisionEnterPayload) => {
          onFloorCollision?.(e);
          onKnockCollision?.(e);
        }
      : undefined;

  // `@react-three/rapier` aplica cualquier opción presente en las props
  // aunque valga `undefined`, y algunas (p. ej. `setAngularDamping`)
  // hacen fallar la WASM de Rapier con él. Sólo se pasan las definidas.
  const optionalProps = {
    ...(ccd !== undefined && { ccd }),
    ...(additionalSolverIterations !== undefined && { additionalSolverIterations }),
    ...(density !== undefined && { density }),
    ...(quaternion !== undefined && { quaternion }),
    ...(linearVelocity !== undefined && { linearVelocity }),
    ...(angularVelocity !== undefined && { angularVelocity }),
  };

  return (
    <RigidBody
      ref={bodyRef}
      type={type}
      colliders={colliders}
      position={position}
      rotation={rotation}
      scale={scale}
      {...optionalProps}
      onCollisionEnter={onCollisionEnter}
    >
      {children}
    </RigidBody>
  );
};

export type { RapierRigidBody };
export default RigidObject;
