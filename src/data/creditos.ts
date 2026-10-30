/**
 * Créditos de los recursos de la escena: modelos 3D y música. Los
 * muestra la ventana que abre la taza (`components/creditos/`).
 *
 * ⚠️ Provisionales: autores, sitios y enlaces son de relleno.
 * Sustituirlos por los reales (el `enlace` debe ir directo a la página
 * del recurso, no a la portada del sitio). La música aún no está en el
 * proyecto: las pistas son inventadas.
 */
export interface Referencia {
  /** Autor del recurso original. */
  autor: string;
  /** Sitio web donde se encontró ("Sketchfab", "Poly Pizza"…). */
  sitio: string;
  /** Enlace directo al recurso. */
  enlace: string;
}

export interface CreditoModelo extends Referencia {
  /** Nombre visible ("Taza", "Teclado"…). */
  nombre: string;
  /** Ruta al `.glb` en `public/`. */
  url: string;
  /** Giro inicial (rad) para que se vea de frente sobre la base. */
  rotacion?: [number, number, number];
}

export interface CreditoMusica extends Referencia {
  titulo: string;
}

export const creditos = {
  modelos: [
    { nombre: 'Escritorio', url: '/3d-models/desk-table.glb', autor: 'Autor por definir', sitio: 'Sketchfab', enlace: 'https://sketchfab.com/' },
    { nombre: 'Monitor', url: '/3d-models/monitor.glb', autor: 'Autor por definir', sitio: 'Sketchfab', enlace: 'https://sketchfab.com/' },
    { nombre: 'Teclado', url: '/3d-models/keyboard.glb', autor: 'Autor por definir', sitio: 'Sketchfab', enlace: 'https://sketchfab.com/' },
    { nombre: 'Ratón', url: '/3d-models/mause.glb', autor: 'Autor por definir', sitio: 'Poly Pizza', enlace: 'https://poly.pizza/' },
    { nombre: 'Alfombrilla', url: '/3d-models/mausePad.glb', autor: 'Autor por definir', sitio: 'Poly Pizza', enlace: 'https://poly.pizza/' },
    { nombre: 'Posavasos', url: '/3d-models/portaVasos.glb', autor: 'Autor por definir', sitio: 'Poly Pizza', enlace: 'https://poly.pizza/' },
    { nombre: 'Taza', url: '/3d-models/taza.glb', autor: 'Autor por definir', sitio: 'CGTrader', enlace: 'https://www.cgtrader.com/' },
    { nombre: 'Portalápices', url: '/3d-models/porta-lapiceros.glb', autor: 'Autor por definir', sitio: 'CGTrader', enlace: 'https://www.cgtrader.com/' },
    { nombre: 'Lápiz', url: '/3d-models/lapiz.glb', autor: 'Autor por definir', sitio: 'CGTrader', enlace: 'https://www.cgtrader.com/' },
    { nombre: 'Mano robótica', url: '/3d-models/roboticHand.glb', autor: 'Autor por definir', sitio: 'Sketchfab', enlace: 'https://sketchfab.com/' },
    { nombre: 'Auriculares', url: '/3d-models/headPhones.glb', autor: 'Autor por definir', sitio: 'Sketchfab', enlace: 'https://sketchfab.com/' },
    { nombre: 'Banda', url: '/3d-models/band.glb', autor: 'Autor por definir', sitio: 'Free3D', enlace: 'https://free3d.com/' },
    { nombre: 'Reloj', url: '/3d-models/clock.glb', autor: 'Autor por definir', sitio: 'Free3D', enlace: 'https://free3d.com/' },
    { nombre: 'Lámpara', url: '/3d-models/lamp.glb', autor: 'Autor por definir', sitio: 'Free3D', enlace: 'https://free3d.com/' },
    { nombre: 'Logo de LinkedIn', url: '/3d-models/logoLinkedin.glb', autor: 'Autor por definir', sitio: 'Sketchfab', enlace: 'https://sketchfab.com/' },
    { nombre: 'Logo de GitHub', url: '/3d-models/gitHubLogo.glb', autor: 'Autor por definir', sitio: 'Sketchfab', enlace: 'https://sketchfab.com/' },
    { nombre: 'Vehículo', url: '/3d-models/vehicle.glb', autor: 'Autor por definir', sitio: 'Poly Pizza', enlace: 'https://poly.pizza/' },
  ] as CreditoModelo[],
  musica: [
    { titulo: 'Lo-fi en la oficina', autor: 'Artista por definir', sitio: 'Pixabay Music', enlace: 'https://pixabay.com/music/' },
    { titulo: 'Café de medianoche', autor: 'Artista por definir', sitio: 'Free Music Archive', enlace: 'https://freemusicarchive.org/' },
    { titulo: 'Teclas y lluvia', autor: 'Artista por definir', sitio: 'Incompetech', enlace: 'https://incompetech.com/' },
    { titulo: 'Paseo en coche', autor: 'Artista por definir', sitio: 'Pixabay Music', enlace: 'https://pixabay.com/music/' },
  ] as CreditoMusica[],
};
