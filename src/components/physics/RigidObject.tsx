import { RigidBody } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import { useRef, type ReactNode } from 'react';
import { useFloorImpact, type FloorImpact } from '../../hooks/useFloorImpact';
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
 *
 * Sonido e impactos (sólo objetos `dynamic`):
 * - `sound`: material con el que suena al golpear el suelo.
 * - `onFloorImpact`: callback con la velocidad del golpe (p. ej. para
 *   romper la taza). Ver `useFloorImpact`.
 */
interface RigidObjectProps {
  type?: 'fixed' | 'dynamic';
  colliders?: 'cuboid' | 'hull' | 'ball';
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  sound?: SoundMaterial;
  onFloorImpact?: (impact: FloorImpact) => void;
  children: ReactNode;
}

const RigidObject = ({
  type = 'dynamic',
  colliders = 'cuboid',
  position,
  rotation,
  scale,
  sound,
  onFloorImpact,
  children,
}: RigidObjectProps) => {
  const bodyRef = useRef<RapierRigidBody>(null);

  const onCollisionEnter = useFloorImpact({
    bodyRef,
    enabled: type === 'dynamic' && (!!sound || !!onFloorImpact),
    sound,
    onFloorImpact,
  });

  return (
    <RigidBody
      ref={bodyRef}
      type={type}
      colliders={colliders}
      position={position}
      rotation={rotation}
      scale={scale}
      onCollisionEnter={onCollisionEnter}
    >
      {children}
    </RigidBody>
  );
};

export type { RapierRigidBody };
export default RigidObject;
