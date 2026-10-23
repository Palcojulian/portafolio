import AutoGLTF from '../physics/AutoGLTF';
import RigidObject from '../physics/RigidObject';
import { useGLTF } from '@react-three/drei';
import { setFocus } from '../../helpers/vista';

/** Enter junto al ratón: la cámara se acerca al monitor. */
const openMonitor = () => setFocus('monitor');

/**
 * Ratón. Cuerpo físico dinámico.
 *
 * El .glb tiene 3 mallas (`mausePart1`, `mausePart2`, `mausePart3`)
 * y 3 materiales (`whiteMaterial`, `blueMaterial`, `colorMaterial`).
 *
 * Interactivo: con el vehículo cerca, Enter acerca la cámara al
 * monitor, que muestra el perfil (`MonitorScreen`).
 */
const Model = () => {
  return (
    <RigidObject
      interactable={{ id: 'mouse', label: 'Ratón', onInteract: openMonitor }}
      type="dynamic"
      sound="plastic"
      colliders="cuboid"
      position={[0.9, 1.48, 0.38]}
      scale={2.4}
      rotation={[0, 0.3, 0]}
    >
      <AutoGLTF url="/3d-models/mause.glb" />
    </RigidObject>
  );
};

useGLTF.preload('/3d-models/mause.glb');

export default Model;