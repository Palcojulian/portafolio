import { useEffect, useState } from 'react';
import { coloresUI as COLORS } from '../../helpers/colores-ui';
import { creditos } from '../../data/creditos';
import BaseGiratoria from './BaseGiratoria';
import FichaReferencia from './FichaReferencia';

const modelos = creditos.modelos;
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

const flecha = (lado: 'left' | 'right') =>
  ({
    position: 'absolute',
    top: '50%',
    [lado]: 8,
    transform: 'translateY(-50%)',
    width: 36,
    height: 36,
    borderRadius: 999,
    border: `1px solid ${COLORS.border}`,
    background: `${COLORS.surface}CC`,
    color: COLORS.text,
    fontSize: 18,
    lineHeight: 1,
    cursor: 'pointer',
  }) as const;

/**
 * Carrusel de los modelos 3D: uno a la vez, girando sobre su base
 * (`BaseGiratoria`), con su ficha al lado (debajo en pantallas
 * estrechas). Se cambia con las flechas ‹ ›, los puntos o ←/→.
 */
const ModelosCarrusel = () => {
  const [index, setIndex] = useState(0);
  const modelo = modelos[index];
  const ir = (paso: number) => setIndex((i) => (i + paso + modelos.length) % modelos.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft') ir(-1);
      if (e.code === 'ArrowRight') ir(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center' }}>
        <div
          style={{
            position: 'relative',
            flex: '1 1 300px',
            height: 300,
            borderRadius: 12,
            background: `radial-gradient(circle at 50% 40%, ${COLORS.surface}, ${COLORS.background} 75%)`,
            border: `1px solid ${COLORS.surface}`,
            overflow: 'hidden',
          }}
        >
          <BaseGiratoria modelo={modelo} />
          <button type="button" aria-label="Modelo anterior" onClick={() => ir(-1)} style={flecha('left')}>
            ‹
          </button>
          <button type="button" aria-label="Modelo siguiente" onClick={() => ir(1)} style={flecha('right')}>
            ›
          </button>
        </div>

        <div style={{ flex: '1 1 220px', minWidth: 0 }}>
          <div style={{ fontFamily: MONO, fontSize: 12, color: COLORS.muted }}>
            {index + 1} / {modelos.length}
          </div>
          <h3 style={{ margin: '4px 0 14px', fontSize: 22, fontWeight: 700 }}>{modelo.nombre}</h3>
          <FichaReferencia referencia={modelo} accion="Ver modelo" />
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Modelos"
        style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginTop: 16 }}
      >
        {modelos.map((m, i) => (
          <button
            key={m.url}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={m.nombre}
            title={m.nombre}
            onClick={() => setIndex(i)}
            style={{
              width: i === index ? 20 : 8,
              height: 8,
              padding: 0,
              borderRadius: 999,
              border: 'none',
              background: i === index ? COLORS.accent : COLORS.border,
              cursor: 'pointer',
              transition: 'width 200ms ease, background 200ms ease',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ModelosCarrusel;
