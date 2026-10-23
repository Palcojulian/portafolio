import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils, Vector3, type PerspectiveCamera } from 'three';
import { CAMERA_POSITION, CAMERA_TARGET } from '../../helpers/camera';
import { SCREEN, screenWorld } from '../../helpers/monitor';
import { CAMERA_TRANSITION_SECONDS, getFocus } from '../../helpers/vista';

/** Margen alrededor de la pantalla al encuadrarla (8 %). */
const SCREEN_MARGIN = 1.08;

/**
 * Cámara fija, con zoom al monitor.
 *
 * Coloca la cámara en `CAMERA_POSITION` mirando a `CAMERA_TARGET` (el
 * centro del escritorio) y no deja moverla: no hay `OrbitControls`, así
 * que el ratón no gira, desplaza ni acerca la vista. El vehículo se
 * maneja sólo con el teclado.
 *
 * Cuando el foco (`helpers/vista.ts`) pasa a `'monitor'`, viaja en
 * `CAMERA_TRANSITION_SECONDS` hasta quedar de frente a la pantalla, a la
 * distancia justa para que quepa entera con el FOV y el aspecto
 * actuales; al volver a `'scene'` deshace el recorrido.
 *
 * Para cambiar la vista, ajusta la distancia o el ángulo en `camera.ts`.
 */
const Controls = () => {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const t = useRef(0);

  const scenePos = useMemo(() => new Vector3(...CAMERA_POSITION), []);
  const sceneTarget = useMemo(() => new Vector3(...CAMERA_TARGET), []);
  const screen = useMemo(() => screenWorld(), []);
  const monitorPos = useMemo(() => new Vector3(), []);
  const lookAt = useMemo(() => new Vector3(), []);

  useLayoutEffect(() => {
    camera.position.copy(scenePos);
    camera.lookAt(sceneTarget);
    camera.updateMatrixWorld();
  }, [camera, scenePos, sceneTarget]);

  useFrame((_, delta) => {
    const goal = getFocus() === 'monitor' ? 1 : 0;
    // En la escena no hay nada que hacer; en el monitor se sigue
    // encuadrando por si cambia el tamaño de la ventana.
    if (goal === 0 && t.current === 0) return;

    const step = delta / CAMERA_TRANSITION_SECONDS;
    t.current = goal > t.current ? Math.min(goal, t.current + step) : Math.max(goal, t.current - step);
    const e = MathUtils.smootherstep(t.current, 0, 1);

    // Distancia a la que la pantalla cabe a lo alto y a lo ancho.
    const tanHalf = Math.tan(MathUtils.degToRad(camera.fov) / 2);
    const distance =
      Math.max(SCREEN.height / 2 / tanHalf, SCREEN.width / 2 / (tanHalf * camera.aspect)) *
      SCREEN_MARGIN;
    monitorPos.copy(screen.center).addScaledVector(screen.normal, distance);

    camera.position.lerpVectors(scenePos, monitorPos, e);
    lookAt.lerpVectors(sceneTarget, screen.center, e);
    camera.lookAt(lookAt);
  });

  return null;
};

export default Controls;
