import { OrbitControls } from '@react-three/drei';

/**
 * Controles de cámara orbital.
 *
 * Permite al visitante rotar la cámara alrededor del escritorio
 * arrastrando con el ratón, y hacer zoom con la rueda. El target es el
 * centro del escritorio, ligeramente elevado.
 *
 * **Límites del foco del escritorio:**
 *
 * - **Panning deshabilitado**: el visitante no puede desplazar la
 *   cámara lateralmente.
 * - **Azimut limitado a ±60°**: la cámara sólo puede girar 60° hacia
 *   cada lado desde la posición inicial. Esto permite ver la planta
 *   (izquierda) y el cuadro (derecha) sin permitir al visitante
 *   "voltearse" y ver la parte trasera de la habitación.
 * - **Distancia limitada entre 2 y 8 unidades**: no puede acercarse
 *   demasiado ni alejarse hasta perder el escritorio.
 * - **Polar limitado a [30°, 82°]**: no puede mirar desde muy arriba
 *   (cenital puro) ni desde abajo del escritorio.
 */
const Controls = () => {
  return (
    <OrbitControls
      target={[0, 1.5, 0]}
      enableZoom={true}
      enableRotate={true}
      enablePan={false}
      minDistance={2}
      maxDistance={8}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2.2}
      minAzimuthAngle={-Math.PI / 3}
      maxAzimuthAngle={Math.PI / 3}
    />
  );
};

export default Controls;