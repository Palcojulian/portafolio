import { useEffect, useState, useSyncExternalStore } from 'react';
import { coloresUI as COLORS } from '../../helpers/colores-ui';
import { getFocus, setFocus, subscribe } from '../../helpers/vista';
import ModelosCarrusel from './ModelosCarrusel';
import MusicaLista from './MusicaLista';

/** Duración de las animaciones de entrada y salida (ms). */
const ENTER_MS = 380;
const EXIT_MS = 200;

type Seccion = 'modelos' | 'musica';

const SECCIONES: { id: Seccion; label: string }[] = [
  { id: 'modelos', label: 'Modelos 3D' },
  { id: 'musica', label: 'Música' },
];

const closeCreditos = () => setFocus('scene');

/**
 * Ventana "Créditos" que abre la taza (`setFocus('creditos')`): de
 * dónde salen los modelos 3D y la música de la escena.
 *
 * - **Overlay HTML fuera del `<Canvas>`** (en `ProgressBridge`), a
 *   diferencia de `ContactoModal`: el carrusel tiene su propio
 *   `<Canvas>` y no conviene anidarlo en un `<Html>` de la escena.
 * - **Animación**: la misma que el modal de contacto (giro 3D leve al
 *   entrar, inverso al salir; se desmonta al acabar). Con "reducir
 *   movimiento" del sistema, sin animación.
 * - **Pestañas**: Modelos 3D (carrusel) y Música (lista). Cada apertura
 *   empieza en Modelos.
 * - **Cierre**: ✕, clic fuera de la tarjeta o Esc.
 *
 * Mientras está abierta, el foco no es `'scene'`: el coche no conduce
 * (así ←/→ solo mueven el carrusel), Enter no interactúa y los overlays
 * de la escena se ocultan.
 */
const CreditosModal = () => {
  const open = useSyncExternalStore(subscribe, getFocus) === 'creditos';
  const [mounted, setMounted] = useState(open);
  const [seccion, setSeccion] = useState<Seccion>('modelos');
  if (open && !mounted) {
    setMounted(true);
    setSeccion('modelos');
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') closeCreditos();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!mounted) return null;

  return (
    <div
      onClick={closeCreditos}
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget && !open) setMounted(false);
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 900,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        boxSizing: 'border-box',
        background: 'rgba(5, 8, 11, 0.55)',
        backdropFilter: 'blur(3px)',
        animation: open
          ? `creditos-fade-in ${ENTER_MS}ms ease both`
          : `creditos-fade-out ${EXIT_MS}ms ease both`,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="creditos-titulo"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: 760,
          maxWidth: '100%',
          maxHeight: '100%',
          overflowY: 'auto',
          boxSizing: 'border-box',
          padding: '26px 28px 24px',
          borderRadius: 14,
          border: `1px solid ${COLORS.surface}`,
          borderTop: `3px solid ${COLORS.accent}`,
          background: COLORS.background,
          color: COLORS.text,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5)',
          transformOrigin: '50% 100%',
          animation: open
            ? `creditos-card-in ${ENTER_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1) both`
            : `creditos-card-out ${EXIT_MS}ms ease both`,
        }}
      >
        <button
          type="button"
          onClick={closeCreditos}
          aria-label="Cerrar"
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 32,
            height: 32,
            borderRadius: 8,
            border: `1px solid ${COLORS.border}`,
            background: COLORS.surface,
            color: COLORS.text,
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          ✕
        </button>
        <div
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
            fontSize: 12,
            color: COLORS.accent,
          }}
        >
          ☕ Créditos
        </div>
        <h2 id="creditos-titulo" style={{ marginTop: 4, fontSize: 24, fontWeight: 700 }}>
          Recursos de la escena
        </h2>
        <p style={{ margin: '6px 0 18px', fontSize: 14, color: COLORS.muted }}>
          La mayoría de modelos y la música vienen de autores de internet; los modelos se
          modificaron para esta escena. Gracias a todos ellos.
        </p>

        <div role="tablist" aria-label="Secciones" style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          {SECCIONES.map(({ id, label }) => {
            const activa = id === seccion;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={activa}
                onClick={() => setSeccion(id)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 8,
                  border: `1px solid ${activa ? COLORS.accent : COLORS.border}`,
                  background: activa ? COLORS.surface : 'transparent',
                  color: activa ? COLORS.accent : COLORS.muted,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {seccion === 'modelos' ? <ModelosCarrusel /> : <MusicaLista />}
      </div>

      <style>{`
        @keyframes creditos-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes creditos-fade-out { from { opacity: 1; } to { opacity: 0; } }
        @keyframes creditos-card-in {
          from { opacity: 0; transform: perspective(900px) translateY(28px) rotateX(12deg) scale(0.94); }
          to { opacity: 1; transform: none; }
        }
        @keyframes creditos-card-out {
          from { opacity: 1; transform: none; }
          to { opacity: 0; transform: perspective(900px) translateY(16px) rotateX(8deg) scale(0.96); }
        }
        @media (prefers-reduced-motion: reduce) {
          [role='dialog'], [role='dialog'] * { animation-duration: 1ms !important; }
        }
      `}</style>
    </div>
  );
};

export default CreditosModal;
