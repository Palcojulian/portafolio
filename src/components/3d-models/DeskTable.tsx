import AutoGLTF from '../physics/AutoGLTF';
import RigidObject from '../physics/RigidObject';
import { useGLTF } from '@react-three/drei';

/**
 * Escritorio. Cuerpo físico fijo (no cae, no se mueve).
 *
 * El escritorio es la superficie sobre la que reposan los demás
 * objetos. Usamos `colliders="cuboid"` (caja envolvente del conjunto)
 * para que los objetos dinámicos reposen correctamente sobre él.
 *
 * El .glb tiene 2 mallas: `estructura` y `table`. AutoGLTF las
 * renderiza todas.
 */
const Model = () => {
  return (
    <RigidObject
      type="fixed"
      colliders="cuboid"
      position={[0, -0.5, 0]}
      draggable={false}
    >
      <AutoGLTF url="/3d-models/desk-table.glb" />
    </RigidObject>
  );
};

useGLTF.preload('/3d-models/desk-table.glb');

export default Model;