import AutoGLTF from '../physics/AutoGLTF';
import RigidObject from '../physics/RigidObject';
import { useGLTF } from '@react-three/drei';

/**
 * Logo de LinkedIn. Cuerpo físico dinámico.
 *
 * El .glb tiene 2 mallas (`baseLogo`, `lettersLogo`) y 2 materiales
 * (`primaryMaterial`, `lettersMaterial`).
 */
const Model = () => {
  return (
    <RigidObject
      type="dynamic"
      sound="plastic"
      colliders="cuboid"
      position={[1.4, 1.49, -0.3]}
      scale={0.4}
    >
      <AutoGLTF url="/3d-models/logoLinkedin.glb" />
    </RigidObject>
  );
};

useGLTF.preload('/3d-models/logoLinkedin.glb');

export default Model;