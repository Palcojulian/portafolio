import { coloresUI as COLORS } from '../../helpers/colores-ui';
import { PANEL_HEIGHT, PANEL_WIDTH } from './PerfilPanel';

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

interface BootScreenProps {
  /** Duración del arranque (ms): lo que tarda en llenarse la barra. */
  duration: number;
}

/**
 * Pantalla de arranque del monitor: logo "3D", "Encendiendo…" y una
 * barra que se llena en `duration` ms (animación CSS, sin JS por
 * fotograma). Mismo estilo que el Loader de la escena.
 *
 * `MonitorScreen` la monta al empezar el zoom, así la animación arranca
 * desde cero en cada encendido.
 */
const BootScreen = ({ duration }: BootScreenProps) => (
  <div
    style={{
      width: PANEL_WIDTH,
      height: PANEL_HEIGHT,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 22,
      background: COLORS.background,
      color: COLORS.text,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      animation: 'monitor-boot-in 300ms ease both',
    }}
  >
    
    <div style={{ fontFamily: MONO, fontSize: 15, color: COLORS.muted, letterSpacing: 1 }}>
      Encendiendo…
    </div>
    <div
      style={{
        width: 260,
        height: 8,
        border: `2px solid ${COLORS.border}`,
        borderRadius: 999,
        background: COLORS.surface,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: '100%',
          background: COLORS.accent,
          animation: `monitor-boot-bar ${duration}ms ease-in-out both`,
        }}
      />
    </div>

    <style>{`
      @keyframes monitor-boot-in { from { opacity: 0; } to { opacity: 1; } }
      @keyframes monitor-boot-pulse { 50% { opacity: 0.55; } }
      @keyframes monitor-boot-bar { from { width: 0%; } to { width: 100%; } }
    `}</style>
  </div>
);

export default BootScreen;
