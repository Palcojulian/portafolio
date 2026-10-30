import AutoGLTF from '../physics/AutoGLTF';
import RigidObject from '../physics/RigidObject';
import { useGLTF } from '@react-three/drei';
import { abrirEnlace } from '../../helpers/abrirEnlace';
import { perfil } from '../../data/perfil';

/** Enter junto al logo: abre el perfil de GitHub en una pestaña nueva. */
const abrirPerfil = () => abrirEnlace(perfil.redes.github);

/**
 * Logo de GitHub. Cuerpo físico dinámico.
 *
 * El .glb tiene 2 mallas (`baseModel`, `iconLogo`) y 2 materiales
 * (`baseModelMaterial`, `iconLogoMaterial`).
 *
 * Interactivo: con el vehículo cerca, Enter abre `perfil.redes.github`
 * (`data/perfil.ts`) en una pestaña nueva.
 */
const Model = () => {
  return (
    <RigidObject
      interactable={{ id: 'github', label: 'GitHub', onInteract: abrirPerfil }}
      type="dynamic"
      sound="plastic"
      colliders="cuboid"
      position={[2, 1.49, 0.7]}
      scale={0.45}
      rotation={[0,-0.5,0]}
    >
      <AutoGLTF url="/3d-models/gitHubLogo.glb" />
    </RigidObject>
  );
};

useGLTF.preload('/3d-models/gitHubLogo.glb');

export default Model;