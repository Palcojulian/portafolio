import { useProgress } from '@react-three/drei';

/**
 * Pantalla de carga de la escena 3D.
 *
 * **Importante**: este componente se renderiza **fuera** del
 * `<Canvas>` de react-three-fiber. Se controla con la variable
 * `active`: cuando es `false`, no muestra nada (devuelve `null`).
 *
 * Usa `useProgress` de `@react-three/drei`, que internamente se
 * suscribe al `GLTFLoader` y reporta el porcentaje total de assets
 * descargados, independientemente del árbol de React donde se monte.
 *
 * Visualmente:
 * - Fondo oscuro semitransparente que cubre toda la ventana.
 * - Spinner circular con borde animado.
 * - Porcentaje numérico de carga.
 */
interface LoaderProps {
  active: boolean;
}

const Loader = ({ active }: LoaderProps) => {
  const { progress } = useProgress();

  if (!active) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(10, 10, 16, 0.95)',
        color: '#ffffff',
        zIndex: 1000,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          border: '4px solid rgba(255, 255, 255, 0.15)',
          borderTopColor: '#F9C74F',
          borderRadius: '50%',
          animation: 'loader-spin 1s linear infinite',
        }}
      />
      <div
        style={{
          marginTop: 24,
          fontSize: 18,
          fontWeight: 500,
          letterSpacing: 0.5,
        }}
      >
        Cargando escena…
      </div>
      <div
        style={{
          marginTop: 8,
          fontSize: 14,
          color: 'rgba(255, 255, 255, 0.6)',
        }}
      >
        {progress.toFixed(0)}%
      </div>

      <style>{`
        @keyframes loader-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loader;