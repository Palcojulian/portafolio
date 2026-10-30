import { coloresUI as COLORS } from '../../helpers/colores-ui';
import { creditos } from '../../data/creditos';
import FichaReferencia from './FichaReferencia';

/** Lista de las pistas de música, cada una con su ficha. */
const MusicaLista = () => (
  <div>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 12,
      }}
    >
      {creditos.musica.map((pista) => (
        <div
          key={pista.titulo}
          style={{
            padding: '14px 16px',
            borderRadius: 12,
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <h3 style={{ margin: '0 0 10px', fontSize: 16, fontWeight: 700 }}>
            <span style={{ color: COLORS.accent }}>♪</span> {pista.titulo}
          </h3>
          <FichaReferencia referencia={pista} accion="Escuchar" />
        </div>
      ))}
    </div>
    <p style={{ marginTop: 14, fontSize: 12, color: COLORS.muted }}>
      Pistas provisionales: la música aún no forma parte de la escena.
    </p>
  </div>
);

export default MusicaLista;
