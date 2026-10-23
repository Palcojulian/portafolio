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
  nombre: 'John Doe',
  rol: 'Desarrollador Frontend · 3D Web',
  ciudad: 'Bogotá, Colombia',
  correo: 'john.doe@example.com',
  /** Ruta al CV en PDF (p. ej. '/cv.pdf' en `public/`). Vacía = sin enlace. */
  cv: '',
  resumen:
    'Desarrollador frontend con 4 años de experiencia creando interfaces web interactivas. ' +
    'Me especializo en React y en experiencias 3D en el navegador con Three.js y ' +
    'react-three-fiber: escenas con físicas, animaciones y un rendimiento cuidado en ' +
    'cualquier dispositivo.',
  experiencia: [
    {
      puesto: 'Frontend Developer',
      empresa: 'Acme Studio',
      periodo: '2023 — actual',
      descripcion: 'Configuradores 3D de producto con R3F y optimización de modelos GLB.',
    },
    {
      puesto: 'Desarrollador Web',
      empresa: 'Pixel Labs',
      periodo: '2021 — 2023',
      descripcion: 'Aplicaciones React + TypeScript y sistema de diseño compartido.',
    },
    {
      puesto: 'Desarrollador Junior',
      empresa: 'Startup XYZ',
      periodo: '2020 — 2021',
      descripcion: 'Landing pages animadas y mantenimiento de un e-commerce.',
    },
  ] as Experiencia[],
  habilidades: ['React', 'TypeScript', 'Three.js', 'R3F', 'Blender', 'Rapier', 'Vite', 'Git'],
  educacion: [
    {
      titulo: 'Ingeniería de Sistemas',
      centro: 'Universidad Ejemplo',
      periodo: '2015 — 2020',
    },
    {
      titulo: 'Curso de gráficos 3D para la web',
      centro: 'Online',
      periodo: '2022',
    },
  ] as Educacion[],
};
