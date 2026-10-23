import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { Controls, keysFor } from '../../helpers/keyboardMap';
import { isMuted, onMutedChange, setMuted } from '../../audio/sound';
import { coloresUI as COLORS } from '../../helpers/colores-ui';

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

const kbdStyle: CSSProperties = {
  display: 'inline-block',
  minWidth: 24,
  padding: '3px 6px',
  margin: '0 2px',
  border: `1px solid ${COLORS.border}`,
  borderBottomWidth: 3,
  borderRadius: 5,
  background: COLORS.surface,
  color: COLORS.accent,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  fontSize: 12,
  lineHeight: 1,
  textAlign: 'center',
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

const Sep = () => <span style={{ color: COLORS.muted }}> / </span>;

/** Letras primero y flechas después, separadas por "/". */
const KeyGroup = ({ keys }: { keys: string[] }) => (
  <span>
    <Keys keys={keys.filter((k) => /^[A-Z]$/.test(k))} />
    <Sep />
    <Keys keys={keys.filter((k) => !/^[A-Z]$/.test(k))} />
  </span>
);

const rowStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 16,
  padding: '4px 0',
};

const Row = ({ label, children }: { label: ReactNode; children: ReactNode }) => (
  <div style={rowStyle}>
    <span>{label}</span>
    <span style={{ whiteSpace: 'nowrap' }}>{children}</span>
  </div>
);

/** Bloque de controles con un título pequeño en el color de acento. */
const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section style={{ marginTop: 12 }}>
    <h3
      style={{
        marginBottom: 2,
        color: COLORS.accent,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 1,
        textTransform: 'uppercase',
      }}
    >
      {title}
    </h3>
    {children}
  </section>
);

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

  const throttleKeys = [...keysFor(Controls.forward), ...keysFor(Controls.back)];
  const steerKeys = [...keysFor(Controls.left), ...keysFor(Controls.right)];

  return (
    <div
      style={{
        position: 'fixed',
        left: 16,
        bottom: 16,
        width: collapsed ? 'auto' : 320,
        maxWidth: 'calc(100vw - 32px)',
        // Fondo de la paleta con ~92 % de opacidad (sufijo alfa "EB").
        background: `${COLORS.background}EB`,
        border: `1px solid ${COLORS.surface}`,
        borderTop: `3px solid ${COLORS.accent}`,
        color: COLORS.text,
        padding: collapsed ? '8px 12px' : '12px 16px 14px',
        borderRadius: 10,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
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
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'none',
            border: 'none',
            color: COLORS.muted,
            cursor: 'pointer',
            fontSize: 12,
            padding: 0,
          }}
        >
          {collapsed ? 'Mostrar' : 'Ocultar'} <kbd style={kbdStyle}>H</kbd>
        </button>
      </div>

      {!collapsed && (
        <>
          <Section title="Conducción">
            <Row label="Acelerar / frenar y marcha atrás">
              <KeyGroup keys={throttleKeys} />
            </Row>
            <Row label="Girar">
              <KeyGroup keys={steerKeys} />
            </Row>
            <Row label="Turbo">
              <Keys keys={keysFor(Controls.run)} />
              <span style={{ color: COLORS.muted }}> + acelerar</span>
            </Row>
            <Row label="Freno de mano">
              <Keys keys={keysFor(Controls.jump)} />
            </Row>
          </Section>

          <Section title="Luces">
            <Row label="Faros">
              <Keys keys={keysFor(Controls.headlights)} />
            </Row>
            <Row label="Direccionales izq. / der.">
              <Keys keys={keysFor(Controls.signalLeft)} />
              <Sep />
              <Keys keys={keysFor(Controls.signalRight)} />
            </Row>
            <Row label="Estacionarias">
              <Keys keys={keysFor(Controls.hazards)} />
            </Row>
          </Section>

          <Section title="General">
            <Row label="Interactuar con el objeto cercano">
              <Keys keys={['Enter']} />
            </Row>
            <Row label="Volver al escritorio">
              <Keys keys={keysFor(Controls.reset)} />
            </Row>
            <Row
              label={
                <>
                  Sonido{' '}
                  <span
                    style={{
                      marginLeft: 4,
                      padding: '1px 6px',
                      borderRadius: 999,
                      fontSize: 11,
                      color: COLORS.background,
                      background: muted ? COLORS.danger : COLORS.ok,
                    }}
                  >
                    {muted ? 'silenciado' : 'activado'}
                  </span>
                </>
              }
            >
              <Keys keys={['M']} />
            </Row>
          </Section>

          <div
            style={{
              marginTop: 12,
              padding: '8px 10px',
              borderLeft: `3px solid ${COLORS.accent}`,
              borderRadius: 4,
              background: COLORS.surface,
              color: COLORS.muted,
              fontSize: 12,
            }}
          >
            🚗 Empuja los objetos ligeros con el coche
            <br />
            ☕ Tira la taza del escritorio y escucha cómo suena
          </div>
        </>
      )}
    </div>
  );
};

export default ControlsHelp;
