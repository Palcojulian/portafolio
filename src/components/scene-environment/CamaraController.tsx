import { useThree } from '@react-three/fiber';

/**
 * Posiciona la cámara en una vista cenital-tres-cuartos del escritorio.
 *
 * La cámara queda fija en `(0, 3, 4)` mirando hacia el origen, lo que
 * encuadra el escritorio completo con suficiente margen para ver
 * también la habitación.
 */
const CameraController = () => {
  const { camera } = useThree();

  camera.position.set(0, 3, 4);
  camera.lookAt(0, 1.5, 0);

  return null;
};

export default CameraController;