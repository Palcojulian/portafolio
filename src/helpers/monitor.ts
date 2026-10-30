import { Vector3 } from 'three';

/** Pose del monitor en la escena (la usa `Monitor.tsx`). */
export const MONITOR_POSITION: [number, number, number] = [0, 1.43, -0.48];
export const MONITOR_ROTATION_Y = 4.7;

/**
 * Pantalla del monitor en coordenadas **locales** del modelo, medida en
 * `monitor.glb`: la malla `screenMonitor` es un plano en x = 0,251 que
 * mira hacia +X local, de 2,03 × 1,04 (≈ 1,95:1).
 *
 * `center` está 1 mm por delante del plano para que el HTML no
 * parpadee contra la malla.
 */
export const SCREEN = {
  center: [0.252, 0.8575, -0.0125] as [number, number, number],
  width: 2.03,
  height: 1.04,
};

/** Centro y normal de la pantalla en mundo (para encuadrar la cámara). */
export const screenWorld = () => {
  const c = Math.cos(MONITOR_ROTATION_Y);
  const s = Math.sin(MONITOR_ROTATION_Y);
  const [x, y, z] = SCREEN.center;
  // Rotación Y: (x, z) → (x·cos + z·sin, −x·sin + z·cos).
  const center = new Vector3(
    MONITOR_POSITION[0] + x * c + z * s,
    MONITOR_POSITION[1] + y,
    MONITOR_POSITION[2] - x * s + z * c
  );
  const normal = new Vector3(c, 0, -s);
  return { center, normal };
};
