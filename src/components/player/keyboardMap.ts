import type { KeyboardControlsEntry } from '@react-three/drei';

/**
 * Acciones del personaje controlables con el teclado.
 *
 * Con el vehículo (`DrivableVehicle`): `forward`/`back` aceleran y
 * frenan (o marcha atrás), `left`/`right` giran, `run` es el turbo y
 * `jump` el freno de mano.
 *
 * Se usa un objeto `as const` en lugar de un `enum` porque el proyecto
 * compila con `erasableSyntaxOnly`.
 */
export const Controls = {
  forward: 'forward',
  back: 'back',
  left: 'left',
  right: 'right',
  jump: 'jump',
  run: 'run',
  reset: 'reset',
} as const;

export type Control = (typeof Controls)[keyof typeof Controls];

/**
 * Mapa acción → teclas (`KeyboardEvent.code`) para `<KeyboardControls>`.
 *
 * `ControlsHelp` lo usa también para mostrar las instrucciones, así las
 * teclas en pantalla nunca se desfasan de las reales.
 */
export const keyboardMap: KeyboardControlsEntry<Control>[] = [
  { name: Controls.forward, keys: ['KeyW', 'ArrowUp'] },
  { name: Controls.back, keys: ['KeyS', 'ArrowDown'] },
  { name: Controls.left, keys: ['KeyA', 'ArrowLeft'] },
  { name: Controls.right, keys: ['KeyD', 'ArrowRight'] },
  { name: Controls.jump, keys: ['Space'] },
  { name: Controls.run, keys: ['ShiftLeft', 'ShiftRight'] },
  { name: Controls.reset, keys: ['KeyR'] },
];

/** Texto legible para cada `KeyboardEvent.code` usado en el mapa. */
export const keyLabels: Record<string, string> = {
  KeyW: 'W',
  KeyA: 'A',
  KeyS: 'S',
  KeyD: 'D',
  KeyR: 'R',
  ArrowUp: '↑',
  ArrowDown: '↓',
  ArrowLeft: '←',
  ArrowRight: '→',
  Space: 'Espacio',
  ShiftLeft: 'Shift',
  ShiftRight: 'Shift',
};
