/**
 * Cámara fija de la escena.
 *
 * Mira al centro del escritorio desde delante y por encima: 2,5 u del
 * objetivo, a 52° de la vertical (polar) y sin girar a los lados
 * (azimut 0). Es la vista que quedaba con los antiguos `OrbitControls`
 * (distancia máxima 2,5) al inclinar la cámara ~17° hacia arriba desde
 * la posición inicial: el cuadro asoma arriba y el escritorio se ve
 * entero.
 */
export const CAMERA_TARGET: [number, number, number] = [0, 1.5, 0];

const DISTANCE = 2.5;
const POLAR = (52 * Math.PI) / 180;

export const CAMERA_POSITION: [number, number, number] = [
  0,
  CAMERA_TARGET[1] + DISTANCE * Math.cos(POLAR),
  CAMERA_TARGET[2] + DISTANCE * Math.sin(POLAR),
];
