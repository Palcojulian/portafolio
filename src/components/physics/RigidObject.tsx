import { RigidBody } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import type { ReactNode } from 'react';
import { useDragObject } from '../../hooks/useDragObject';

/**
 * Wrapper que convierte un modelo 3D en un cuerpo físico de Rapier.
 *
 * Sustituye al `<group>` tradicional: aplica position, rotation y scale
 * al RigidBody en lugar del group, y permite que el objeto participe
 * en la simulación de físicas.
 *
 * - **type="fixed"**: el objeto no se mueve. Útil para superficies como
 *   el escritorio, el monitor, el mausePad y el portaVasos.
 * - **type="dynamic"**: el objeto cae por gravedad y puede colisionar
 *   con otros. Si `draggable` está activo, el visitante puede arrastrarlo
 *     con el ratón.
 *
 * Colliders:
 * - `cuboid` (por defecto): una caja que envuelve todo el modelo. Es
 *   la opción más eficiente y predecible. Funciona bien incluso cuando
 *   el modelo tiene muchas mallas (como el teclado con 102 teclas).
 * - `hull`: forma envolvente más fiel pero potencialmente más lenta con
 *   modelos complejos.
 * - `ball`: esfera envolvente (no usada en este proyecto).
 *
 * Los handlers de pointer (drag) se aplican a un `<group>` hijo que
 * envuelve el modelo. Rapier no expone `onPointerDown` directamente en
 * `RigidBody`, así que el listener se monta en el group interior y desde
 * ahí `useDragObject` puede recorrer el árbol hasta encontrar el
 * RigidBody.
 */
interface RigidObjectProps {
  type?: 'fixed' | 'dynamic';
  colliders?: 'cuboid' | 'hull' | 'ball';
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  draggable?: boolean;
  children: ReactNode;
}

const RigidObject = ({
  type = 'dynamic',
  colliders = 'cuboid',
  position,
  rotation,
  scale,
  draggable = true,
  children,
}: RigidObjectProps) => {
  const { handlePointerDown, handlePointerMove, handlePointerUp } =
    useDragObject();

  const isInteractive = type === 'dynamic' && draggable;

  return (
    <RigidBody
      type={type}
      colliders={colliders}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      <group
        onPointerDown={isInteractive ? handlePointerDown : undefined}
        onPointerMove={isInteractive ? handlePointerMove : undefined}
        onPointerUp={isInteractive ? handlePointerUp : undefined}
      >
        {children}
      </group>
    </RigidBody>
  );
};

export type { RapierRigidBody };
export default RigidObject;