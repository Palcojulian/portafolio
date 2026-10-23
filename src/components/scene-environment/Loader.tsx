import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { useProgress } from '@react-three/drei';
import { Controls, keysFor } from '../player/keyboardMap';
import { coloresUI as COLORS } from '../../helpers/colores-ui';

/** Nombre y subtítulo mostrados en la pantalla de carga (provisionales). */
const OWNER_NAME = 'John Doe';
const OWNER_TAGLINE = 'Portafolio interactivo';

/** Milisegundos que permanece visible cada consejo. */
const TIP_INTERVAL = 3500;

/** Duración del fundido de salida al terminar la carga (ms). */
const FADE_OUT_MS = 400;

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

/** Sólo las letras (sin flechas) de una acción: W, A, S, D… */
const letters = (action: Parameters<typeof keysFor>[0]) =>
  keysFor(action).filter((k) => /^[A-Z]$/.test(k));

interface Tip {
  keys: string[];
  text: ReactNode;
}

/**
 * Consejos rotativos. Las teclas salen de `keyboardMap`, así que
 * coinciden siempre con las reales (igual que en `ControlsHelp`).
 */
const TIPS: Tip[] = [
  {
    keys: [
      ...letters(Controls.forward),
      ...letters(Controls.left),
      ...letters(Controls.back),
      ...letters(Controls.right),
    ],
    text: 'para mover el vehículo',
  },
  { keys: keysFor(Controls.run), text: '+ acelerar para activar el turbo' },
  { keys: keysFor(Controls.jump), text: 'para el freno de mano' },
  { keys: keysFor(Controls.headlights), text: 'para encender los faros' },
  { keys: keysFor(Controls.reset), text: 'para volver al escritorio' },
  { keys: ['H'], text: 'para mostrar u ocultar la ayuda' },
  { keys: ['M'], text: 'para silenciar el sonido' },
];

/** Texto de estado según el último asset que reporta `useProgress`. */
const statusFor = (item: string): string => {
  if (/\.(glb|gltf)(\?|$)/i.test(item)) return 'Cargando modelos 3D…';
  if (/\.(png|jpe?g|webp|ktx2|hdr)(\?|$)/i.test(item)) return 'Cargando texturas…';
  return 'Preparando escena…';
};

const kbdStyle: CSSProperties = {
  display: 'inline-block',
  minWidth: 30,
  padding: '5px 6px',
  margin: '0 2px',
  border: `2px solid ${COLORS.border}`,
  borderBottomWidth: 4,
  borderRadius: 6,
  background: COLORS.surface,
  color: COLORS.accent,
  fontFamily: MONO,
  fontSize: 13,
  lineHeight: 1,
  textAlign: 'center',
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
 * - Consejo de controles que rota cada `TIP_INTERVAL` ms.
 */
interface LoaderProps {
  active: boolean;
}

const Loader = ({ active }: LoaderProps) => {
  const { progress, item } = useProgress();
  const [shown, setShown] = useState(0);
  const [mounted, setMounted] = useState(active);
  const [tip, setTip] = useState(0);

  // Ajustes de estado durante el render (patrón recomendado por React
  // para derivar estado de props sin un efecto extra).
  if (progress > shown) setShown(progress);
  if (active && !mounted) setMounted(true);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setTip((t) => (t + 1) % TIPS.length), TIP_INTERVAL);
    return () => clearInterval(id);
  }, [active]);

  if (!mounted) return null;

  const percent = Math.round(active ? shown : 100);
  const current = TIPS[tip];

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
      
      <style>{`
        @keyframes loader-tip-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
};

export default Loader;
