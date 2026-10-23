import AutoGLTF from '../physics/AutoGLTF';
import RigidObject from '../physics/RigidObject';
import { useGLTF } from '@react-three/drei';

const POSITION: [number, number, number] = [-2.2, 1.48, 0.56];
const SCALE = 0.6;

/**
 * Taza. Cuerpo físico dinámico.
 *
 * El .glb tiene una única malla (`tazaModel`) y 2 materiales
 * (`baseMaterial`, `secondaryMaterial`). Si cae al suelo sólo suena a
 * cerámica (`sound="ceramic"`); no se rompe.
 */
const Model = () => {
  return (
    <RigidObject
      type="dynamic"
      sound="ceramic"
      colliders="cuboid"
      position={POSITION}
      scale={SCALE}
    >
      <AutoGLTF url="/3d-models/taza.glb" />
    </RigidObject>
  );
};

useGLTF.preload('/3d-models/taza.glb');

export default Model;
