import { useState } from 'react';
import { useProgress } from '@react-three/drei';
import { coloresUI as COLORS } from '../../helpers/colores-ui';

/** Nombre y subtítulo mostrados en la pantalla de carga (provisionales). */
const OWNER_NAME = 'John Doe';
const OWNER_TAGLINE = 'Portafolio interactivo';

/** Duración del fundido de salida al terminar la carga (ms). */
const FADE_OUT_MS = 400;

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

/** Texto de estado según el último asset que reporta `useProgress`. */
const statusFor = (item: string): string => {
  if (/\.(glb|gltf)(\?|$)/i.test(item)) return 'Cargando modelos 3D…';
  if (/\.(png|jpe?g|webp|ktx2|hdr)(\?|$)/i.test(item)) return 'Cargando texturas…';
  return 'Preparando escena…';
};

/**
 * Pantalla de carga de la escena 3D (wireframe de Figma).
 *
 * **Importante**: este componente se renderiza **fuera** del
 * `<Canvas>` de react-three-fiber. Se controla con la variable
 * `active`: al pasar a `false` se desvanece y deja de renderizarse.
 *
 * Usa `useProgress` de `@react-three/drei`, que internamente se
 * suscribe al `GLTFLoader` y reporta el porcentaje total de assets
 * descargados, independientemente del árbol de React donde se monte.
 *
 * Visualmente:
 * - Logo "3D", nombre y subtítulo.
 * - Barra ligada al progreso real, con estado y porcentaje (HU-17).
 *   Nunca retrocede: cuando el chunk lazy de físicas encola más
 *   modelos, `progress` baja, pero la barra mantiene el máximo.
 */
interface LoaderProps {
  active: boolean;
}

const Loader = ({ active }: LoaderProps) => {
  const { progress, item } = useProgress();
  const [shown, setShown] = useState(0);
  const [mounted, setMounted] = useState(active);

  // Ajustes de estado durante el render (patrón recomendado por React
  // para derivar estado de props sin un efecto extra).
  if (progress > shown) setShown(progress);
  if (active && !mounted) setMounted(true);

  if (!mounted) return null;

  const percent = Math.round(active ? shown : 100);

  return (
    <div
      onTransitionEnd={(e) => {
        if (e.target === e.currentTarget && !active) setMounted(false);
      }}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 16px',
        background: COLORS.background,
        color: COLORS.text,
        zIndex: 1000,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        opacity: active ? 1 : 0,
        pointerEvents: active ? 'auto' : 'none',
        transition: `opacity ${FADE_OUT_MS}ms ease`,
      }}
    >
      <div
        style={{
          width: 112,
          height: 112,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `3px solid ${COLORS.accent}`,
          borderRadius: 24,
          background: COLORS.surface,
          color: COLORS.accent,
          fontSize: 28,
          fontWeight: 700,
        }}
      >
        3D
      </div>

      <h1 style={{ marginTop: 36, fontSize: 32, fontWeight: 700, textAlign: 'center' }}>
        {OWNER_NAME}
      </h1>
      <p style={{ marginTop: 8, fontSize: 16, color: COLORS.muted }}>{OWNER_TAGLINE}</p>

      <div style={{ width: 424, maxWidth: '100%', marginTop: 44 }}>
        <div
          role="progressbar"
          aria-label="Progreso de carga"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          style={{
            height: 14,
            border: `2px solid ${COLORS.border}`,
            borderRadius: 999,
            background: COLORS.surface,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${percent}%`,
              height: '100%',
              background: COLORS.accent,
              transition: 'width 200ms ease-out',
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 10,
            fontFamily: MONO,
            fontSize: 14,
            color: COLORS.muted,
          }}
        >
          <span>{active ? statusFor(item) : 'Listo'}</span>
          <span>{percent}%</span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
