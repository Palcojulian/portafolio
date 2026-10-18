import { useLayoutEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { CAMERA_POSITION, CAMERA_TARGET } from './camera';

/**
 * Cámara fija.
 *
 * Coloca la cámara en `CAMERA_POSITION` mirando a `CAMERA_TARGET` (el
 * centro del escritorio) y no deja moverla: no hay `OrbitControls`, así
 * que el ratón no gira, desplaza ni acerca la vista. El vehículo se
 * maneja sólo con el teclado.
 *
 * Para cambiar la vista, ajusta la distancia o el ángulo en `camera.ts`.
 */
const Controls = () => {
  const camera = useThree((s) => s.camera);

  useLayoutEffect(() => {
    camera.position.set(...CAMERA_POSITION);
    camera.lookAt(...CAMERA_TARGET);
    camera.updateMatrixWorld();
  }, [camera]);

  return null;
};

export default Controls;
