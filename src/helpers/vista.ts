/**
 * Qué tiene el foco: la escena (se conduce), la pantalla del monitor o
 * el formulario de contacto.
 *
 * - El ratón (Enter) llama a `setFocus('monitor')`; el panel de la
 *   pantalla, Esc o "Volver a la escena" llaman a `setFocus('scene')`.
 * - `Controls` anima la cámara entre las dos vistas.
 * - La pantalla del monitor se enciende al acercarse la cámara y
 *   muestra el perfil cuando termina el arranque.
 * - El portalápices (Enter) llama a `setFocus('contacto')`: el modal de
 *   contacto aparece sin mover la cámara.
 * - El vehículo, el aviso de interacción y el panel de controles se
 *   desactivan mientras el foco no es `'scene'`.
 *
 * Módulo plano (sin React), igual que `interaccion.ts`: se lee desde
 * `useFrame` sin provocar renders, y los overlays HTML se suscriben con
 * `useSyncExternalStore`.
 */
export type Focus = 'scene' | 'monitor' | 'contacto';

/** Duración del viaje de la cámara entre la escena y el monitor (s). */
export const CAMERA_TRANSITION_SECONDS = 1.2;

let focus: Focus = 'scene';
const listeners = new Set<() => void>();

export const getFocus = () => focus;

export const setFocus = (next: Focus) => {
  if (next === focus) return;
  focus = next;
  listeners.forEach((l) => l());
};

export const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
