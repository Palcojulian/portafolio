import AutoGLTF from '../physics/AutoGLTF';
import RigidObject from '../physics/RigidObject';
import { BULKY_DENSITY } from '../../helpers/density';
import { useGLTF } from '@react-three/drei';

/**
 * Teclado. Cuerpo físico dinámico.
 *
 * El .glb tiene 102 mallas (cada tecla individual + bases). AutoGLTF
 * las renderiza todas. Los materiales son `whiteKeys`, `skyKeys`,
 * `plate`, `switchColor`, `blueKeys`.
 *
 * Collider `cuboid`: una caja envolvente es suficiente y mucho más
 * barata que un hull sobre 102 mallas.
 */
const Model = () => {
  return (
    <RigidObject
      type="dynamic"
      sound="plastic"
      colliders="cuboid"
      density={BULKY_DENSITY}
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