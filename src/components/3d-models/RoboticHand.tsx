import AutoGLTF from '../physics/AutoGLTF';
import RigidObject from '../physics/RigidObject';
import { BULKY_DENSITY } from '../physics/density';
import { useGLTF } from '@react-three/drei';

/**
 * Mano robótica. Cuerpo físico dinámico.
 *
 * El .glb tiene una única malla (`roboticHand`) y un material `Material`.
 */
const Model = () => {
  return (
    <RigidObject
      type="dynamic"
      sound="metal"
      colliders="cuboid"
      density={BULKY_DENSITY}
      position={[-1.4, 1.48, -0.5]}
      scale={1.2}
      rotation={[0, -4.6, 0]}
    >
      <AutoGLTF url="/3d-models/roboticHand.glb" />
    </RigidObject>
  );
};

useGLTF.preload('/3d-models/roboticHand.glb');

export default Model;