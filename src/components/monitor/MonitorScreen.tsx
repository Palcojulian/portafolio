import { useEffect, useState, useSyncExternalStore } from 'react';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { MONITOR_POSITION, MONITOR_ROTATION_Y, SCREEN } from '../../helpers/monitor';
import { CAMERA_TRANSITION_SECONDS, getFocus, setFocus, subscribe } from '../../helpers/vista';
import BootScreen from './BootScreen';
import PerfilPanel, { PANEL_HEIGHT, PANEL_WIDTH } from './PerfilPanel';

/** Margen con el que `Controls` encuadra la pantalla (ver `SCREEN_MARGIN`). */
const ZOOMED_MARGIN = 1.08;
/**
 * Resolución máxima del panel respecto a su tamaño base (evita capas
 * enormes). 3,5 cubre un 4K al 100 % (3840 px → panel de ~3560 px).
 */
const MAX_RESOLUTION = 3.5;
/**
 * El hueco que drei abre en el canvas es un poco más pequeño que el
 * HTML: el borde del HTML queda tapado por la malla de la pantalla y no
 * asoma ninguna franja entre ambos (ver comentario del componente).
 */
const HOLE_INSET = 0.994;

/**
 * Arranque de la pantalla (ms), contado desde que empieza el zoom: el
 * perfil aparece cuando acaba, y nunca antes de que llegue la cámara.
 */
const BOOT_MS = Math.max(2000, CAMERA_TRANSITION_SECONDS * 1000);

/** Pantalla apagada: casi negra, con un reflejo suave de cristal.
 *  `#0b1015` es también el fondo de la página (`index.css`). */
const OFF_BACKGROUND =
  'linear-gradient(135deg, #10161c 0%, #0b1015 45%, #141b22 55%, #0b1015 100%)';

const closeMonitor = () => setFocus('scene');

/**
 * Factor de resolución del panel: cuántas veces su tamaño base hace
 * falta para que, con la cámara en el monitor, el navegador **reduzca**
 * la imagen en vez de ampliarla (ampliarla es lo que la emborronaba en
 * pantallas QHD). Se redondea a cuartos para no recalcular en cada
 * píxel de cambio de ventana.
 */
const resolutionFor = (width: number, height: number) => {
  const shown = Math.min(width, height * (PANEL_WIDTH / PANEL_HEIGHT)) / ZOOMED_MARGIN;
  const k = Math.ceil((shown / PANEL_WIDTH) * 4) / 4;
  return Math.min(MAX_RESOLUTION, Math.max(1, k));
};

/**
 * Pantalla del monitor. Tres estados, según el foco (`helpers/vista.ts`):
 *
 * - `off`: en la vista de escena, pantalla apagada (casi negra).
 * - `booting`: al accionar el ratón empieza el zoom y la pantalla
 *   muestra `BootScreen` ("Encendiendo…" + barra) durante `BOOT_MS`.
 * - `on`: termina el arranque y aparece el perfil (`PerfilPanel`), con
 *   sus botones y Esc para volver. Al volver, se apaga al instante.
 *
 * - **HTML real** con `<Html transform>` de drei, colocado sobre el
 *   plano de la pantalla (`SCREEN`, coordenadas locales del monitor).
 *   Va como hermano del RigidObject, no dentro: la malla de oclusión de
 *   drei generaría un collider automático.
 * - **Oclusión `blending`**: el HTML queda detrás del `<Canvas>` y drei
 *   abre un hueco transparente con una malla; así un objeto 3D que pase
 *   por delante del monitor lo tapa. Para que el HTML reciba clics,
 *   drei pone `pointer-events: none` en el canvas (la escena no usa
 *   eventos de puntero de R3F).
 * - **Nitidez**: el panel se maqueta a su tamaño base y se amplía con
 *   CSS `zoom` (`resolutionFor`), dividiendo `distanceFactor` por lo
 *   mismo. Mide igual en la escena, pero el navegador lo rasteriza a la
 *   resolución con la que se verá de cerca.
 * - **Sin bordes**: el HTML (CSS3D) y el hueco (WebGL) redondean sus
 *   bordes distinto, y por las franjas sub-píxel asomaba el fondo blanco
 *   de la página. El hueco es una `geometry` propia un `HOLE_INSET` más
 *   pequeña que el HTML (con `geometry`, drei no la reescala), y la
 *   página tiene fondo oscuro por si acaso.
 * - `zIndexRange` bajo: con el de drei por defecto (~16 M) el canvas y
 *   el panel quedarían por encima del Loader y de los overlays HTML.
 */
const MonitorScreen = () => {
  const focus = useSyncExternalStore(subscribe, getFocus);
  const focused = focus === 'monitor';

  // Al cambiar el foco se reinicia el arranque (ajuste de estado durante
  // el render, el patrón de React para derivarlo sin un efecto extra).
  const [booted, setBooted] = useState(false);
  const [prevFocused, setPrevFocused] = useState(focused);
  if (focused !== prevFocused) {
    setPrevFocused(focused);
    setBooted(false);
  }
  const phase = !focused ? 'off' : booted ? 'on' : 'booting';

  useEffect(() => {
    if (!focused || booted) return;
    const id = setTimeout(() => setBooted(true), BOOT_MS);
    return () => clearTimeout(id);
  }, [focused, booted]);

  const { width, height } = useThree((s) => s.size);
  // Apagada no hace falta resolución: así en la vista de escena la capa
  // del navegador mide 1040 × 533 px en vez de hasta ~3640 × 1866. Sube
  // al empezar el zoom; los 2 s de arranque dan tiempo a rasterizarla.
  const resolution = phase === 'off' ? 1 : resolutionFor(width, height);
  // `Html transform`: 1 px CSS = distanceFactor / 400 unidades.
  const distanceFactor = (SCREEN.width * 400) / (PANEL_WIDTH * resolution);

  useEffect(() => {
    if (!focused) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') closeMonitor();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [focused]);

  return (
    <group position={MONITOR_POSITION} rotation={[0, MONITOR_ROTATION_Y, 0]}>
      <Html
        transform
        occlude="blending"
        distanceFactor={distanceFactor}
        position={SCREEN.center}
        rotation={[0, Math.PI / 2, 0]}
        zIndexRange={[100, 0]}
        geometry={<planeGeometry args={[SCREEN.width * HOLE_INSET, SCREEN.height * HOLE_INSET]} />}
        pointerEvents={phase === 'on' ? 'auto' : 'none'}
      >
        <div style={{ zoom: resolution }}>
          {phase === 'off' && (
            <div style={{ width: PANEL_WIDTH, height: PANEL_HEIGHT, background: OFF_BACKGROUND }} />
          )}
          {phase === 'booting' && <BootScreen duration={BOOT_MS} />}
          {phase === 'on' && (
            <div style={{ animation: 'monitor-panel-in 350ms ease both' }}>
              <PerfilPanel onClose={closeMonitor} />
            </div>
          )}
          <style>{`@keyframes monitor-panel-in { from { opacity: 0; } to { opacity: 1; } }`}</style>
        </div>
      </Html>
    </group>
  );
};

export default MonitorScreen;
