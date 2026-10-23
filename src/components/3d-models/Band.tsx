import AutoGLTF from '../physics/AutoGLTF';
import RigidObject from '../physics/RigidObject';
import { useGLTF } from '@react-three/drei';

/**
 * Banda elástica. Cuerpo físico dinámico.
 *
 * El .glb tiene 5 mallas (caja, botón, correa, hebilla, pantalla)
 * y 2 materiales (`cajon`, `correa`). AutoGLTF los mapea todos.
 */
const Model = () => {
  return (
    <RigidObject
      interactable={{ id: 'pulsera', label: 'Pulsera' }}
      type="dynamic"
      sound="plastic"
      colliders="cuboid"
      position={[-1.4, 1.535, 0.4]}
      scale={0.45}
      rotation={[0, 1, 1.46]}
    >
      <AutoGLTF url="/3d-models/band.glb" />
    </RigidObject>
  );
};

useGLTF.preload('/3d-models/band.glb');

export default Model;