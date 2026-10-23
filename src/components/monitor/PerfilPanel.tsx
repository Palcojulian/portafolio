import type { CSSProperties, ReactNode } from 'react';
import { coloresUI as COLORS } from '../../helpers/colores-ui';
import { perfil } from '../../data/perfil';

/** Tamaño del panel en px CSS: el aspecto de la pantalla (2,03 × 1,04). */
export const PANEL_WIDTH = 1040;
export const PANEL_HEIGHT = 533;

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

const chipStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '3px 10px',
  border: `1px solid ${COLORS.border}`,
  borderRadius: 999,
  background: COLORS.surface,
  color: COLORS.text,
  fontSize: 12,
  lineHeight: 1.3,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
};

const buttonBase: CSSProperties = {
  padding: '9px 18px',
  borderRadius: 8,
  fontFamily: 'inherit',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
};

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section>
    <h3
      style={{
        marginBottom: 10,
        color: COLORS.accent,
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: 1,
        textTransform: 'uppercase',
      }}
    >
      {title}
    </h3>
    {children}
  </section>
);

interface PerfilPanelProps {
  onClose: () => void;
}

/**
 * Panel "Sobre mí" que se ve en la pantalla del monitor (wireframe de
 * Figma), con los colores de los overlays (`coloresUI`) y los datos de
 * `data/perfil.ts`.
 *
 * Mide exactamente `PANEL_WIDTH × PANEL_HEIGHT` px: `MonitorScreen` lo
 * escala para que ocupe la pantalla entera.
 *
 * Solo se muestra con la pantalla encendida, tras el zoom y el
 * arranque (`MonitorScreen`).
 */
const PerfilPanel = ({ onClose }: PerfilPanelProps) => (
  <div
    style={{
      position: 'relative',
      width: PANEL_WIDTH,
      height: PANEL_HEIGHT,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      padding: '26px 34px 22px',
      background: COLORS.background,
      color: COLORS.text,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      overflow: 'hidden',
      userSelect: 'none',
    }}
  >
    <button
      type="button"
      onClick={onClose}
      aria-label="Cerrar"
      style={{
        ...buttonBase,
        position: 'absolute',
        top: 18,
        right: 22,
        width: 36,
        height: 36,
        padding: 0,
        border: `1px solid ${COLORS.border}`,
        background: COLORS.surface,
        color: COLORS.text,
        fontSize: 16,
      }}
    >
      ✕
    </button>

    {/* Cabecera */}
    <header style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <div
        aria-hidden
        style={{
          width: 96,
          height: 96,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          border: `3px solid ${COLORS.accent}`,
          background: COLORS.surface,
          color: COLORS.accent,
          fontSize: 32,
          fontWeight: 700,
        }}
      >
        {perfil.nombre
          .split(' ')
          .map((p) => p[0])
          .join('')}
      </div>
      <div>
        <div style={{ fontFamily: MONO, fontSize: 13, color: COLORS.muted }}>Sobre mí</div>
        <h1 style={{ margin: '2px 0 2px', fontSize: 30, fontWeight: 700 }}>{perfil.nombre}</h1>
        <div style={{ fontSize: 14, color: COLORS.muted }}>{perfil.rol}</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <span style={chipStyle}>📍 {perfil.ciudad}</span>
          <a href={`mailto:${perfil.correo}`} style={chipStyle}>
            ✉ {perfil.correo}
          </a>
          {perfil.cv ? (
            <a href={perfil.cv} download style={{ ...chipStyle, color: COLORS.accent }}>
              ⬇ CV (PDF)
            </a>
          ) : (
            <span style={{ ...chipStyle, opacity: 0.6 }} title="Próximamente">
              ⬇ CV (PDF)
            </span>
          )}
        </div>
      </div>
    </header>

    {/* Cuerpo: dos columnas */}
    <div
      style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1.15fr 1fr',
        gap: 36,
        marginTop: 22,
        minHeight: 0,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Section title="Resumen">
          <p style={{ fontSize: 13, lineHeight: 1.5, color: COLORS.muted }}>{perfil.resumen}</p>
        </Section>
        <Section title="Experiencia">
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 }}>
            {perfil.experiencia.map((e) => (
              <li key={e.puesto + e.empresa} style={{ display: 'flex', gap: 10 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    marginTop: 5,
                    flexShrink: 0,
                    borderRadius: '50%',
                    background: COLORS.accent,
                  }}
                />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>
                    {e.puesto} · <span style={{ color: COLORS.muted }}>{e.empresa}</span>
                    <span style={{ marginLeft: 8, fontFamily: MONO, fontSize: 11, color: COLORS.muted }}>
                      {e.periodo}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.muted }}>{e.descripcion}</div>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Section title="Habilidades">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {perfil.habilidades.map((h) => (
              <span key={h} style={chipStyle}>
                {h}
              </span>
            ))}
          </div>
        </Section>
        <Section title="Educación">
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {perfil.educacion.map((e) => (
              <li
                key={e.titulo}
                style={{
                  padding: '8px 12px',
                  borderLeft: `3px solid ${COLORS.accent}`,
                  borderRadius: 4,
                  background: COLORS.surface,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600 }}>{e.titulo}</div>
                <div style={{ fontSize: 12, color: COLORS.muted }}>
                  {e.centro} · <span style={{ fontFamily: MONO }}>{e.periodo}</span>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>

    {/* Pie */}
    <footer
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 14,
      }}
    >
      <button
        type="button"
        onClick={onClose}
        style={{
          ...buttonBase,
          border: `1px solid ${COLORS.accent}`,
          background: COLORS.accent,
          color: COLORS.background,
        }}
      >
        ← Volver a la escena
      </button>
      <button
        type="button"
        disabled
        title="Próximamente"
        style={{
          ...buttonBase,
          border: `1px solid ${COLORS.border}`,
          background: 'transparent',
          color: COLORS.muted,
          cursor: 'not-allowed',
        }}
      >
        Ver proyectos → <span style={{ fontWeight: 400, fontSize: 12 }}>(próximamente)</span>
      </button>
    </footer>
  </div>
);

export default PerfilPanel;
