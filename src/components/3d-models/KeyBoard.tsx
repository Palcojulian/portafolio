import AutoGLTF from '../physics/AutoGLTF';
import RigidObject from '../physics/RigidObject';
import { useGLTF } from '@react-three/drei';

/**
 * Teclado. Cuerpo físico dinámico.
 *
 * El .glb tiene 102 mallas (cada tecla individual + bases). AutoGLTF
 * las renderiza todas. Los materiales son `whiteKeys`, `skyKeys`,
 * `plate`, `switchColor`, `blueKeys`.
 *
 * Collider `hull` porque el hull envolvente da mejor soporte para
 * colisiones que un cuboid.
 */
const Model = () => {
  return (
    <RigidObject
      type="dynamic"
      colliders="cuboid"
      position={[0, 1.55, 0.38]}
      scale={1.7}
      rotation={[0, 0.05, 0]}
    >
      <AutoGLTF url="/3d-models/keyboard.glb" />
    </RigidObject>
  );
};

useGLTF.preload('/3d-models/keyboard.glb');

export default Model;