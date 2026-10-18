import AutoGLTF from '../physics/AutoGLTF';
import RigidObject from '../physics/RigidObject';
import { BULKY_DENSITY } from '../physics/density';
import { useGLTF } from '@react-three/drei';

/**
 * Auriculares. Cuerpo físico dinámico.
 *
 * El .glb tiene 3 mallas (arco, almohadilla izquierda, almohadilla
 * derecha) y 2 materiales (`baseMaterial`, `Material`).
 */
const Model = () => {
  return (
    <RigidObject
      type="dynamic"
      sound="plastic"
      colliders="cuboid"
      density={BULKY_DENSITY}
      position={[1.5, 1.57, 0.4]}
      scale={1.6}
      rotation={[0, 0.7, -1.68]}
    >
      <AutoGLTF url="/3d-models/headPhones.glb" />
    </RigidObject>
  );
};

useGLTF.preload('/3d-models/headPhones.glb');

export default Model;