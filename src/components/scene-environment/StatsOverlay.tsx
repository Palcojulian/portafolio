import { useEffect, useState } from 'react';

/**
 * Overlay de diagnóstico de rendimiento.
 *
 * Muestra en la esquina superior derecha los FPS actuales.
 *
 * **Sólo para desarrollo**: `App.tsx` lo monta únicamente cuando
 * `import.meta.env.DEV` es `true`, así en producción ni siquiera se
 * arranca el bucle de `requestAnimationFrame`.
 */
const StatsOverlay = () => {
  const [fps, setFps] = useState(0);

  useEffect(() => {
    let frame = 0;
    let lastTime = performance.now();
    let frames = 0;

    const tick = () => {
      frame = requestAnimationFrame(tick);
      frames++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        const currentFps = Math.round((frames * 1000) / (now - lastTime));
        setFps(currentFps);
        frames = 0;
        lastTime = now;
      }
    };

    tick();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 16,
        right: 16,
        background: 'rgba(10, 10, 16, 0.85)',
        color: '#ffffff',
        padding: '8px 12px',
        borderRadius: 6,
        fontFamily: 'monospace',
        fontSize: 12,
        lineHeight: 1.5,
        zIndex: 999,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          color: fps >= 50 ? '#90BE6D' : fps >= 30 ? '#F9C74F' : '#F94144',
        }}
      >
        FPS: {fps}
      </div>
    </div>
  );
};

export default StatsOverlay;