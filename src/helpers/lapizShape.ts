/**
 * Forma física del lápiz, ya **escalada** (`PENCIL_SCALE`).
 *
 * El modelo mide 0.603 a lo largo de +Y (punta en 0) con un radio de
 * ≈ 0.015. Los colliders se definen en unidades de mundo en lugar de
 * meterlos en un grupo con `scale`: `@react-three/rapier` multiplica la
 * posición de un collider anidado por la escala de su padre, que ya
 * está incluida en su matriz, y la aplicaría dos veces.
 */
export const PENCIL_SCALE = 0.9;
export const PENCIL_RADIUS = 0.015 * PENCIL_SCALE;
/** Semialtura del tramo recto de la cápsula (sin las semiesferas). */
export const PENCIL_HALF_HEIGHT = (0.603 / 2 - 0.015) * PENCIL_SCALE;
/** Altura del centro de la cápsula sobre la punta. */
export const PENCIL_CENTER_Y = (0.603 / 2) * PENCIL_SCALE;

/**
 * Iteraciones extra del solver para los lápices y el portalápices: con
 * las de por defecto, en un choque un lápiz podía meterse ~1 cm en la
 * pared.
 */
export const PENCIL_SOLVER_ITERATIONS = 4;
