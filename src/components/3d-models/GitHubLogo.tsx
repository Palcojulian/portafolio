import AutoGLTF from '../physics/AutoGLTF';
import RigidObject from '../physics/RigidObject';
import { useGLTF } from '@react-three/drei';

/**
 * Logo de GitHub. Cuerpo físico dinámico.
 *
 * El .glb tiene 2 mallas (`baseModel`, `iconLogo`) y 2 materiales
 * (`baseModelMaterial`, `iconLogoMaterial`).
 */
const Model = () => {
  return (
    <RigidObject
      type="dynamic"
      sound="plastic"
      colliders="cuboid"
      position={[1.65, 1.49, -0.3]}
      scale={0.45}
    >
      <AutoGLTF url="/3d-models/gitHubLogo.glb" />
    </RigidObject>
  );
};

useGLTF.preload('/3d-models/gitHubLogo.glb');

export default Model;