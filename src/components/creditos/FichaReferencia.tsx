import { coloresUI as COLORS } from '../../helpers/colores-ui';
import type { Referencia } from '../../data/creditos';

interface FichaReferenciaProps {
  referencia: Referencia;
  /** Texto del enlace ("Ver modelo", "Escuchar"…). */
  accion: string;
}

const Dato = ({ etiqueta, valor }: { etiqueta: string; valor: string }) => (
  <div style={{ marginBottom: 8 }}>
    <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.6, color: COLORS.muted }}>
      {etiqueta}
    </div>
    <div style={{ fontSize: 15 }}>{valor}</div>
  </div>
);

/**
 * Autor, sitio y enlace directo de un recurso. La comparten el carrusel
 * de modelos y la lista de música.
 */
const FichaReferencia = ({ referencia, accion }: FichaReferenciaProps) => (
  <div>
    <Dato etiqueta="Autor" valor={referencia.autor} />
    <Dato etiqueta="Sitio web" valor={referencia.sitio} />
    <a
      href={referencia.enlace}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-block',
        marginTop: 6,
        padding: '7px 14px',
        borderRadius: 8,
        background: COLORS.accent,
        color: COLORS.background,
        fontSize: 14,
        fontWeight: 600,
        textDecoration: 'none',
      }}
    >
      {accion} ↗
    </a>
  </div>
);

export default FichaReferencia;
