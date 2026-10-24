/**
 * Datos del perfil profesional que muestra la pantalla del monitor
 * (`components/monitor/PerfilPanel.tsx`).
 *
 * ⚠️ Provisionales: nombre y textos de relleno. Sustituir por los
 * reales cuando estén listos.
 */
export interface Experiencia {
  puesto: string;
  empresa: string;
  periodo: string;
  descripcion: string;
}

export interface Educacion {
  titulo: string;
  centro: string;
  periodo: string;
}

export const perfil = {
  nombre: 'Julian Palco',
  rol: 'Desarrollador full stack',
  ciudad: 'Cali, Colombia',
  correo: 'palcojulian@outlook.com',
  /** Ruta al CV en PDF (p. ej. '/cv.pdf' en `public/`). Vacía = sin enlace. */
  cv: '',
  /**
   * Perfiles que abren los logos 3D del escritorio (Enter junto a cada
   * uno). ⚠️ Provisionales: la home de cada red; sustituir por los
   * perfiles reales.
   */
  redes: {
    linkedin: 'www.linkedin.com/in/julian-palco-23a670247',
    github: 'https://github.com/Palcojulian',
  },
  resumen:
    'Desarrollador frontend con 4 años de experiencia creando interfaces web interactivas. ' +
    'Me especializo en React y en experiencias 3D en el navegador con Three.js y ' +
    'react-three-fiber: escenas con físicas, animaciones y un rendimiento cuidado en ' +
    'cualquier dispositivo.',
  experiencia: [
    {
      puesto: 'Desarrollador full stack',
      empresa: 'Cuidarte en casa SAS',
      periodo: '2023 — actual',
      descripcion: 'Configuradores 3D de producto con R3F y optimización de modelos GLB.',
    },

  ] as Experiencia[],
  habilidades: ['Vue', 'React', 'Vite', 'TypeScript', 'Php', 'Laravel','Msql', 'Git'],
  educacion: [
    {
      titulo: 'Tecnologia en sistemas de informacion',
      centro: 'Universidad del valle',
      periodo: '2019 — 2022',
    },
  ] as Educacion[],
};
