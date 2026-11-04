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
    { nombre: 'Modern Office Desk', url: '/3d-models/desk-table.glb', autor: 'FatWasHere', sitio: 'Sketchfab', enlace: 'https://skfb.ly/p8Lzr' },
    { nombre: 'Office Monitor / Workstation Monitor', url: '/3d-models/monitor.glb', autor: 'DatSketch', sitio: 'Sketchfab', enlace: 'https://skfb.ly/6VD8p' },
    { nombre: 'keyboard', url: '/3d-models/keyboard.glb', autor: '45P3R4', sitio: 'Sketchfab', enlace: 'https://skfb.ly/6UFI8' },
    { nombre: 'Low poly - Computer Mouse', url: '/3d-models/mause.glb', autor: 'IQINSO', sitio: 'Sketchfab', enlace: 'https://skfb.ly/pM8xn' },
    { nombre: 'Taza', url: '/3d-models/taza.glb', autor: 'Josep', sitio: 'Sketchfab', enlace: 'https://skfb.ly/Wptp' },
    { nombre: 'Pencil', url: '/3d-models/lapiz.glb', autor: 'Mateo Kladaric', sitio: 'Sketchfab', enlace: 'https://skfb.ly/onCuH' },
    { nombre: 'Low Poly Robot Hand', url: '/3d-models/roboticHand.glb', autor: 'Caiussegarra', sitio: 'Sketchfab', enlace: 'https://skfb.ly/pBvG8' },
    { nombre: 'Audífonos / Headphones', url: '/3d-models/headPhones.glb', autor: 'jivoid', sitio: 'Sketchfab', enlace: 'https://skfb.ly/oUP7Z' },
    { nombre: 'Smart Watch Low Poly', url: '/3d-models/band.glb', autor: 'ahmadrezagh671', sitio: 'Sketchfab', enlace: 'https://skfb.ly/oYGHC' },
    { nombre: 'Alarm Clock', url: '/3d-models/clock.glb', autor: 'dion.manganiello', sitio: 'Sketchfab', enlace: 'https://skfb.ly/o9rVR' },
    { nombre: '80s Lamp Low Poly', url: '/3d-models/lamp.glb', autor: 'lucasalic00', sitio: 'Sketchfab', enlace: 'https://skfb.ly/o9pSB' },
    { nombre: '3D Linkedin Logo', url: '/3d-models/logoLinkedin.glb', autor: 'pengedarseni', sitio: 'Sketchfab', enlace: 'https://skfb.ly/oPKUJ' },
    { nombre: '3D Github Logo', url: '/3d-models/gitHubLogo.glb', autor: 'pengedarseni', sitio: 'Sketchfab', enlace: 'https://skfb.ly/oPKSO' },
    { nombre: 'Vehículo', url: '/3d-models/vehicle.glb', autor: 'Alejandro de Costas', sitio: 'Youtube', enlace: 'https://youtu.be/YsH2XQDL3ds' },
  ] as CreditoModelo[],
  musica: [
    { titulo: 'Lo-fi en la oficina', autor: 'Artista por definir', sitio: 'Pixabay Music', enlace: 'https://pixabay.com/music/' },
    { titulo: 'Café de medianoche', autor: 'Artista por definir', sitio: 'Free Music Archive', enlace: 'https://freemusicarchive.org/' },
    { titulo: 'Teclas y lluvia', autor: 'Artista por definir', sitio: 'Incompetech', enlace: 'https://incompetech.com/' },
    { titulo: 'Paseo en coche', autor: 'Artista por definir', sitio: 'Pixabay Music', enlace: 'https://pixabay.com/music/' },
  ] as CreditoMusica[],
};
