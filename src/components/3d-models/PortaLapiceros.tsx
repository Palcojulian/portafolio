import AutoGLTF from '../physics/AutoGLTF';
import RigidObject from '../physics/RigidObject';
import { useGLTF } from '@react-three/drei';

/**
 * Portalápices. Cuerpo físico dinámico: el visitante puede arrastrarlo
 * junto con los lápices que contiene.
 *
 * El .glb tiene una única malla (`portaLapiceros`) y un material
 * `Material`.
 */
const Model = () => {
  return (
    <RigidObject
      type="dynamic"
      colliders="cuboid"
      position={[-2, 1.48, -0.4]}
      scale={1}
    >
      <AutoGLTF url="/3d-models/porta-lapiceros.glb" />
    </RigidObject>
  );
};

useGLTF.preload('/3d-models/porta-lapiceros.glb');

export default Model;