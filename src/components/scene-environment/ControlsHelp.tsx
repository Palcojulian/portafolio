import { useEffect, useState, type CSSProperties } from 'react';
import { Controls, keyLabels, keyboardMap, type Control } from '../player/keyboardMap';
import { isMuted, onMutedChange, setMuted } from '../../audio/sound';

const STORAGE_KEY = 'controls-help-collapsed';

const readCollapsed = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
};

const writeCollapsed = (value: boolean): void => {
  try {
    localStorage.setItem(STORAGE_KEY, value ? '1' : '0');
  } catch {
    // Almacenamiento no disponible (modo privado, etc.): se ignora.
  }
};

/** Teclas (sin duplicados de etiqueta) asignadas a una acción del mapa. */
const keysFor = (action: Control): string[] => {
  const entry = keyboardMap.find((e) => e.name === action);
  return [...new Set((entry?.keys ?? []).map((k) => keyLabels[k] ?? k))];
};

const kbdStyle: CSSProperties = {
  display: 'inline-block',
  minWidth: 22,
  padding: '2px 6px',
  margin: '0 2px',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderBottomWidth: 2,
  borderRadius: 4,
  fontFamily: 'inherit',
  fontSize: 12,
  textAlign: 'center',
  background: 'rgba(255, 255, 255, 0.08)',
};

const Keys = ({ keys }: { keys: string[] }) => (
  <>
    {keys.map((k) => (
      <kbd key={k} style={kbdStyle}>
        {k}
      </kbd>
    ))}
  </>
);

const rowStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 16,
  padding: '4px 0',
};

/**
 * Panel con las instrucciones de control del personaje.
 *
 * Se renderiza fuera del `<Canvas>` (overlay HTML), abajo a la
 * izquierda. Las teclas se leen de `keyboardMap`, así que siempre
 * coinciden con las reales. Se pliega con el botón o con la tecla H, y
 * el estado se recuerda en `localStorage`. La tecla M silencia el
 * sonido (`src/audio/sound.ts`).
 */
interface ControlsHelpProps {
  hidden: boolean;
}

const ControlsHelp = ({ hidden }: ControlsHelpProps) => {
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [muted, setMutedState] = useState(isMuted);

  useEffect(() => onMutedChange(setMutedState), []);

  useEffect(() => writeCollapsed(collapsed), [collapsed]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.code === 'KeyH') setCollapsed((c) => !c);
      if (e.code === 'KeyM') setMuted(!isMuted());
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (hidden) return null;

  const moveKeys = [
    ...keysFor(Controls.forward),
    ...keysFor(Controls.left),
    ...keysFor(Controls.back),
    ...keysFor(Controls.right),
  ];

  return (
    <div
      style={{
        position: 'fixed',
        left: 16,
        bottom: 16,
        maxWidth: 'calc(100vw - 32px)',
        background: 'rgba(10, 10, 16, 0.85)',
        color: '#ffffff',
        padding: collapsed ? '8px 12px' : '12px 16px',
        borderRadius: 8,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: 13,
        lineHeight: 1.4,
        zIndex: 999,
        userSelect: 'none',
      }}
    >
      <div style={{ ...rowStyle, padding: 0 }}>
        <strong style={{ fontSize: 14 }}>Controles</strong>
        <button
          type="button"
          onClick={(e) => {
            setCollapsed((c) => !c);
            // Sin foco: si no, Espacio (saltar) volvería a pulsar el botón.
            e.currentTarget.blur();
          }}
          aria-expanded={!collapsed}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.7)',
            cursor: 'pointer',
            fontSize: 12,
            padding: 0,
          }}
        >
          {collapsed ? 'Mostrar' : 'Ocultar'} <kbd style={kbdStyle}>H</kbd>
        </button>
      </div>

      {!collapsed && (
        <div style={{ marginTop: 8 }}>
          <div style={rowStyle}>
            <span>Moverse</span>
            <span>
              <Keys keys={moveKeys.filter((k) => /^[A-Z]$/.test(k))} />
              <span style={{ opacity: 0.6 }}> / </span>
              <Keys keys={moveKeys.filter((k) => !/^[A-Z]$/.test(k))} />
            </span>
          </div>
          <div style={rowStyle}>
            <span>Correr</span>
            <span>
              <Keys keys={keysFor(Controls.run)} /> + mover
            </span>
          </div>
          <div style={rowStyle}>
            <span>Saltar</span>
            <Keys keys={keysFor(Controls.jump)} />
          </div>
          <div style={rowStyle}>
            <span>Volver al escritorio</span>
            <Keys keys={keysFor(Controls.reset)} />
          </div>
          <div style={rowStyle}>
            <span>Sonido {muted ? '🔇 silenciado' : '🔊 activado'}</span>
            <Keys keys={['M']} />
          </div>
          <div
            style={{
              marginTop: 8,
              paddingTop: 8,
              borderTop: '1px solid rgba(255, 255, 255, 0.15)',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: 12,
            }}
          >
            🖱️ Arrastra con el ratón para girar la cámara
            <br />
            💡 Mueve los objetos empujándolos con el gato
            <br />
            ☕ Cuidado con la taza: se rompe si cae al suelo
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlsHelp;
