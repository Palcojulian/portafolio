import AutoGLTF from '../physics/AutoGLTF';
import RigidObject from '../physics/RigidObject';
import { useGLTF } from '@react-three/drei';

/**
 * Taza. Cuerpo físico dinámico.
 *
 * El .glb tiene una única malla (`tazaModel`) y 2 materiales
 * (`baseMaterial`, `secondaryMaterial`).
 */
const Model = () => {
  return (
    <RigidObject
      type="dynamic"
      colliders="cuboid"
      position={[-2.2, 1.48, 0.56]}
      scale={0.6}
    >
      <AutoGLTF url="/3d-models/taza.glb" />
    </RigidObject>
  );
};

useGLTF.preload('/3d-models/taza.glb');

export default Model;