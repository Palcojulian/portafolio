import { Mesh, MeshStandardMaterial } from 'three';
import { useGLTF } from '@react-three/drei';
import RigidObject from '../physics/RigidObject';
import { paletaColores } from '../../helpers/paleta-colores';

/**
 * Porta-vasos. Cuerpo físico fijo (anclado al escritorio).
 *
 * El .glb NO incluye materiales (verified: `materials: []`).
 * Asignamos el mismo material que el mausePad: tela gris oscura con
 * acabado mate.
 *
 * El .glb tiene una única malla llamada `portaVasos`.
 */
const Model = () => {
  const { nodes } = useGLTF('/3d-models/portaVasos.glb');

  const portaVasosMaterial = new MeshStandardMaterial({
    color: paletaColores.azulGrisOscuro[300],
    roughness: 0.95,
    metalness: 0,
  });

  return (
    <RigidObject
      type="fixed"
      colliders="cuboid"
      position={[-2.2, 1.485, 0.57]}
      scale={0.7}
      rotation={[0, 0, 0]}
      draggable={false}
    >
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.portaVasos as Mesh).geometry}
        material={portaVasosMaterial}
      />
    </RigidObject>
  );
};

useGLTF.preload('/3d-models/portaVasos.glb');

export default Model;