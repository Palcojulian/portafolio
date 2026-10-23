import AutoGLTF from '../physics/AutoGLTF';
import RigidObject from '../physics/RigidObject';
import MonitorScreen from '../monitor/MonitorScreen';
import { MONITOR_POSITION, MONITOR_ROTATION_Y } from '../../helpers/monitor';
import { useGLTF } from '@react-three/drei';

/**
 * Monitor. Cuerpo físico fijo: no se cae ni se mueve.
 *
 * El .glb tiene 8 mallas (base, pantalla, puertos, etc.). AutoGLTF
 * las renderiza todas. Collider `cuboid` porque la forma general es
 * una caja.
 *
 * `MonitorScreen` enciende la pantalla y muestra el perfil cuando el
 * ratón acerca la cámara (ver `helpers/vista.ts`). Va fuera del
 * RigidObject para que su malla de oclusión no genere un collider.
 */
const Model = () => {
  return (
    <>
      <RigidObject
        type="fixed"
        colliders="cuboid"
        position={MONITOR_POSITION}
        scale={1}
        rotation={[0, MONITOR_ROTATION_Y, 0]}
      >
        <AutoGLTF url="/3d-models/monitor.glb" />
      </RigidObject>
      <MonitorScreen />
    </>
  );
};

useGLTF.preload('/3d-models/monitor.glb');

export default Model;
