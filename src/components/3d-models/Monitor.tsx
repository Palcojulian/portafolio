import AutoGLTF from '../physics/AutoGLTF';
import RigidObject from '../physics/RigidObject';
import { useGLTF } from '@react-three/drei';

/**
 * Monitor. Cuerpo físico fijo: no se cae ni se mueve.
 *
 * El .glb tiene 8 mallas (base, pantalla, puertos, etc.). AutoGLTF
 * las renderiza todas. Collider `cuboid` porque la forma general es
 * una caja.
 */
const Model = () => {
  return (
    <RigidObject
      type="fixed"
      colliders="cuboid"
      position={[0, 1.43, -0.48]}
      scale={1}
      rotation={[0, 4.7, 0]}
    >
      <AutoGLTF url="/3d-models/monitor.glb" />
    </RigidObject>
  );
};

useGLTF.preload('/3d-models/monitor.glb');

export default Model;