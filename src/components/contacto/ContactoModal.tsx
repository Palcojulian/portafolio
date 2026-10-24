import { useEffect, useState, useSyncExternalStore } from 'react';
import { Html } from '@react-three/drei';
import { CAMERA_TARGET } from '../../helpers/camera';
import { coloresUI as COLORS } from '../../helpers/colores-ui';
import { getFocus, setFocus, subscribe } from '../../helpers/vista';
import ContactoForm from './ContactoForm';

/** Duración de las animaciones de entrada y salida (ms). */
const ENTER_MS = 380;
const EXIT_MS = 200;

const closeContacto = () => setFocus('scene');

/** Siempre en el centro del canvas, se mueva o no la cámara. */
const centerOfCanvas = (_el: unknown, _camera: unknown, size: { width: number; height: number }) => [
  size.width / 2,
  size.height / 2,
];

/**
 * Modal "Contáctame" que abre el portalápices (`setFocus('contacto')`).
 *
 * - **HTML en la escena** con `<Html fullscreen>` de drei, anclado al
 *   centro del escritorio (`CAMERA_TARGET`, siempre delante de la
 *   cámara, así drei no lo oculta). `calculatePosition` lo fija al
 *   centro del canvas: el fondo cubre toda la vista y la tarjeta queda
 *   centrada.
 * - **Animación**: la tarjeta entra con un giro 3D leve (perspectiva +
 *   `rotateX`), subiendo y escalando; el fondo se funde. Al cerrar hace
 *   lo inverso y se desmonta al acabar. Con "reducir movimiento" del
 *   sistema, sin animación.
 * - **Cierre**: ✕, Cancelar, clic fuera de la tarjeta o Esc.
 * - `zIndexRange` por encima del canvas y de la pantalla del monitor,
 *   pero dentro de `#canvas-container` (contexto de apilamiento propio).
 *
 * Mientras está abierto, el foco no es `'scene'`: el coche no conduce,
 * Enter no interactúa y los overlays de la escena se ocultan.
 */
const ContactoModal = () => {
  const open = useSyncExternalStore(subscribe, getFocus) === 'contacto';
  const [mounted, setMounted] = useState(open);
  if (open && !mounted) setMounted(true);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') closeContacto();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!mounted) return null;

  return (
    <Html
      fullscreen
      position={CAMERA_TARGET}
      calculatePosition={centerOfCanvas}
      zIndexRange={[300, 200]}
    >
      <div
        onClick={closeContacto}
        onAnimationEnd={(e) => {
          if (e.target === e.currentTarget && !open) setMounted(false);
        }}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          boxSizing: 'border-box',
          background: 'rgba(5, 8, 11, 0.55)',
          backdropFilter: 'blur(3px)',
          animation: open
            ? `contacto-fade-in ${ENTER_MS}ms ease both`
            : `contacto-fade-out ${EXIT_MS}ms ease both`,
        }}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="contacto-titulo"
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'relative',
            width: 540,
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
              ? `contacto-card-in ${ENTER_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1) both`
              : `contacto-card-out ${EXIT_MS}ms ease both`,
          }}
        >
          <button
            type="button"
            onClick={closeContacto}
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
            ✏️ Contacto
          </div>
          <h2 id="contacto-titulo" style={{ marginTop: 4, fontSize: 24, fontWeight: 700 }}>
            Contáctame
          </h2>
          <p style={{ margin: '6px 0 20px', fontSize: 14, color: COLORS.muted }}>
            ¿Tienes un proyecto o una idea? Déjame un mensaje y te responderé.
          </p>
          <ContactoForm onClose={closeContacto} />
        </div>

        <style>{`
          @keyframes contacto-fade-in { from { opacity: 0; } to { opacity: 1; } }
          @keyframes contacto-fade-out { from { opacity: 1; } to { opacity: 0; } }
          @keyframes contacto-card-in {
            from { opacity: 0; transform: perspective(900px) translateY(28px) rotateX(12deg) scale(0.94); }
            to { opacity: 1; transform: none; }
          }
          @keyframes contacto-card-out {
            from { opacity: 1; transform: none; }
            to { opacity: 0; transform: perspective(900px) translateY(16px) rotateX(8deg) scale(0.96); }
          }
          @media (prefers-reduced-motion: reduce) {
            [role='dialog'], [role='dialog'] * { animation-duration: 1ms !important; }
          }
        `}</style>
      </div>
    </Html>
  );
};

export default ContactoModal;
