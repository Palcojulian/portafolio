import { useSyncExternalStore } from 'react';
import { coloresUI as COLORS } from '../../helpers/colores-ui';
import { getActive, subscribe } from '../../helpers/interaccion';

interface InteractionPromptProps {
  hidden: boolean;
}

/**
 * Aviso "Enter · Interactuar con X" abajo al centro, solo mientras el
 * vehículo está cerca de un objeto interactivo.
 *
 * Overlay HTML fuera del `<Canvas>`. Lee el objeto activo del store
 * `helpers/interaccion.ts` con `useSyncExternalStore`, así solo se
 * vuelve a renderizar cuando cambia el objeto, no cada fotograma.
 */
const InteractionPrompt = ({ hidden }: InteractionPromptProps) => {
  const active = useSyncExternalStore(subscribe, getActive);
  const visible = !hidden && active !== null;

  return (
    <div
      aria-live="polite"
      style={{
        position: 'fixed',
        left: '50%',
        bottom: 24,
        maxWidth: 'calc(100vw - 32px)',
        transform: `translate(-50%, ${visible ? 0 : 8}px)`,
        opacity: visible ? 1 : 0,
        transition: 'opacity 200ms ease, transform 200ms ease',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 14px',
        borderRadius: 999,
        background: `${COLORS.background}EB`,
        border: `1px solid ${COLORS.surface}`,
        color: COLORS.text,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: 13,
        whiteSpace: 'nowrap',
        zIndex: 999,
        userSelect: 'none',
      }}
    >
      <kbd
        style={{
          padding: '3px 7px',
          border: `1px solid ${COLORS.border}`,
          borderBottomWidth: 3,
          borderRadius: 5,
          background: COLORS.surface,
          color: COLORS.accent,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
          fontSize: 12,
          lineHeight: 1,
        }}
      >
        Enter
      </kbd>
      <span>
        <span style={{ color: COLORS.muted }}>Interactuar con </span>
        {active?.label}
      </span>
    </div>
  );
};

export default InteractionPrompt;
