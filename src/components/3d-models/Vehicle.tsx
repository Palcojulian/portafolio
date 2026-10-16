import AutoGLTF from '../physics/AutoGLTF';
import RigidObject from '../physics/RigidObject';
import { useGLTF } from '@react-three/drei';

/**
 * Vehículo decorativo. Cuerpo físico dinámico.
 *
 * El .glb tiene una única malla (`car`) y 7 materiales (carrocería,
 * luces blancas, naranjas, grises, rines, ventanas, luces rojas).
 */
const Model = () => {
  return (
    <RigidObject
      type="dynamic"
      sound="plastic"
      colliders="cuboid"
      position={[-2, 1.49, 0.2]}
      scale={0.15}
      rotation={[0, 1, 0]}
    >
      <AutoGLTF url="/3d-models/vehicle.glb" />
    </RigidObject>
  );
};

useGLTF.preload('/3d-models/vehicle.glb');

export default Model;