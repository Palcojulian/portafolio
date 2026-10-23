import { amarillos, azulGrisClaro, azulGrisOscuro, rojos, verdes } from './paleta-colores';

/**
 * Colores de los overlays HTML (pantalla de carga, panel de controles),
 * tomados de `paleta-colores.ts`: los mismos azul-gris "oficina" de la
 * escena y el amarillo de acento de la lámpara.
 */
export const coloresUI = {
  background: azulGrisOscuro[100],
  surface: azulGrisOscuro[300],
  border: azulGrisClaro[400],
  accent: amarillos[500],
  text: '#ffffff',
  muted: azulGrisClaro[100],
  ok: verdes[500],
  danger: rojos[500],
} as const;
