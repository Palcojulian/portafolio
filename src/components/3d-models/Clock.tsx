import AutoGLTF from '../physics/AutoGLTF';
import RigidObject from '../physics/RigidObject';
import { useGLTF } from '@react-three/drei';

/**
 * Reloj. Cuerpo físico dinámico.
 *
 * El .glb tiene 3 mallas (caja, pantalla, soporte) y 3 materiales
 * (`boxMaterial`, `screenMaterial`, `baseMaterial`).
 */
const Model = () => {
  return (
    <RigidObject
      type="dynamic"
      sound="plastic"
      colliders="cuboid"
      position={[0.7, 1.476, -0.3]}
      scale={4}
      rotation={[0, 0, 0]}
    >
      <AutoGLTF url="/3d-models/clock.glb" />
    </RigidObject>
  );
};

useGLTF.preload('/3d-models/clock.glb');

export default Model;