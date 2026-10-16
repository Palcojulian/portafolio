import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/**
 * Configuración de Vite.
 *
 * **Code-splitting manual** para mantener el bundle inicial pequeño:
 *
 * - `three`: la librería three.js, la más pesada. Se separa en su
 *   propio chunk para que el navegador la descargue en paralelo.
 * - `r3f`: react-three-fiber + @react-three/drei.
 * - `rapier`: @react-three/rapier (incluye el WASM). Se carga
 *   bajo demanda vía `React.lazy` en `App.tsx`.
 *
 * Esto reduce el coste del primer render: el bundle principal ya
 * no contiene el motor de físicas.
 */
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string): string | undefined {
          if (id.includes('node_modules/three/')) return 'three';
          if (
            id.includes('node_modules/@react-three/fiber') ||
            id.includes('node_modules/@react-three/drei')
          ) {
            return 'r3f';
          }
          if (id.includes('node_modules/@react-three/rapier')) {
            return 'rapier';
          }
          return undefined;
        },
      },
    },
  },
});