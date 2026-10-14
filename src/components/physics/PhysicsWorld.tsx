import type { ReactNode } from 'react';
import { Physics } from '@react-three/rapier';

/**
 * Proveedor de físicas para la escena.
 *
 * Envuelve a los componentes físicos en un <Physics> de @react-three/rapier
 * con la configuración por defecto del proyecto:
 *
 * - **gravity**: -9.81 en Y, igual que la gravedad terrestre.
 * - **timeStep**: 1/60s por defecto (gestionado internamente).
 *
 * Para activar/desactivar físicas durante el desarrollo se puede
 * pasar `paused`. Útil en herramientas de debug.
 *
 * Sólo los hijos envueltos en `<RigidBody>` (vía `RigidObject`) responden
 * a las físicas. El resto de la escena (entorno, decoraciones) es estático.
 */
interface PhysicsWorldProps {
  children: ReactNode;
  paused?: boolean;
}

const PhysicsWorld = ({ children, paused = false }: PhysicsWorldProps) => {
  return (
    <Physics gravity={[0, -9.81, 0]} paused={paused}>
      {children}
    </Physics>
  );
};

export default PhysicsWorld;