/**
 * Densidad de los objetos dinámicos voluminosos (teclado, lámpara, mano
 * robótica, auriculares).
 *
 * Con la densidad por defecto (1) pesan casi lo mismo que la taza, y el
 * vehículo (`DrivableVehicle`, masa ~0,1) los arrastraría por la mesa.
 * Con esta, el vehículo choca con ellos y se detiene; los ligeros
 * (taza, lápices, logos, reloj, ratón) los sigue empujando.
 */
export const BULKY_DENSITY = 100;
