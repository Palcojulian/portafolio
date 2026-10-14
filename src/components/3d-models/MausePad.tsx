import { Mesh, MeshStandardMaterial } from 'three';
import { useGLTF } from '@react-three/drei';
import RigidObject from '../physics/RigidObject';
import { paletaColores } from '../../helpers/paleta-colores';

/**
 * Alfombrilla del ratón. Cuerpo físico fijo.
 *
 * El .glb NO incluye materiales (verified: `materials: []`).
 * Asignamos un material de tela gris oscura desde la paleta.
 *
 * El .glb tiene una única malla llamada `mausePad`.
 */
const Model = () => {
  const { nodes } = useGLTF('/3d-models/mausePad.glb');

  const mausePadMaterial = new MeshStandardMaterial({
    color: paletaColores.azulGrisOscuro[300],
    roughness: 0.95,
    metalness: 0,
  });

  return (
    <RigidObject
      type="fixed"
      colliders="cuboid"
      position={[0.15, 1.485, 0.35]}
      scale={0.3}
      rotation={[0, 0, 0]}
      draggable={false}
    >
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.mausePad as Mesh).geometry}
        material={mausePadMaterial}
      />
    </RigidObject>
  );
};

useGLTF.preload('/3d-models/mausePad.glb');

export default Model;