import AutoGLTF from '../physics/AutoGLTF';
import RigidObject from '../physics/RigidObject';
import { useGLTF } from '@react-three/drei';
import { abrirEnlace } from '../../helpers/abrirEnlace';
import { perfil } from '../../data/perfil';

/** Enter junto al logo: abre el perfil de LinkedIn en una pestaña nueva. */
const abrirPerfil = () => abrirEnlace(perfil.redes.linkedin);

/**
 * Logo de LinkedIn. Cuerpo físico dinámico.
 *
 * El .glb tiene 2 mallas (`baseLogo`, `lettersLogo`) y 2 materiales
 * (`primaryMaterial`, `lettersMaterial`).
 *
 * Interactivo: con el vehículo cerca, Enter abre `perfil.redes.linkedin`
 * (`data/perfil.ts`) en una pestaña nueva.
 */
const Model = () => {
  return (
    <RigidObject
      interactable={{ id: 'linkedin', label: 'LinkedIn', onInteract: abrirPerfil }}
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