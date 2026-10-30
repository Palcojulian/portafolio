import { useState, type CSSProperties, type FormEvent } from 'react';
import { coloresUI as COLORS } from '../../helpers/colores-ui';
import {
  CONTACTO_VACIO,
  MAX_LONGITUD,
  enviarContacto,
  validarContacto,
  type ContactoDatos,
  type ContactoErrores,
} from '../../helpers/contacto';

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

const labelStyle: CSSProperties = {
  display: 'block',
  marginBottom: 6,
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0.5,
  color: COLORS.muted,
};

const fieldStyle = (error?: string): CSSProperties => ({
  width: '100%',
  boxSizing: 'border-box',
  padding: '10px 12px',
  border: `1px solid ${error ? COLORS.danger : COLORS.border}`,
  borderRadius: 8,
  background: COLORS.surface,
  color: COLORS.text,
  fontFamily: 'inherit',
  fontSize: 14,
  outline: 'none',
});

const errorStyle: CSSProperties = { marginTop: 4, fontSize: 12, color: COLORS.danger };

const buttonBase: CSSProperties = {
  padding: '10px 18px',
  borderRadius: 8,
  fontFamily: 'inherit',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
};

type Estado = 'editando' | 'enviando' | 'enviado' | 'error';

interface ContactoFormProps {
  onClose: () => void;
}

/**
 * Formulario "Contáctame": nombre, correo, asunto (opcional) y mensaje.
 *
 * Valida al enviar (`validarContacto`) y, si está bien, llama a
 * `enviarContacto` (`helpers/contacto.ts`), que por ahora solo captura
 * el mensaje. Tras enviar muestra un mensaje de éxito. El estado se
 * reinicia cada vez que se abre el modal (se vuelve a montar).
 */
const ContactoForm = ({ onClose }: ContactoFormProps) => {
  const [datos, setDatos] = useState<ContactoDatos>(CONTACTO_VACIO);
  const [errores, setErrores] = useState<ContactoErrores>({});
  const [estado, setEstado] = useState<Estado>('editando');

  const set = (campo: keyof ContactoDatos) => (valor: string) => {
    setDatos((d) => ({ ...d, [campo]: valor }));
    // El error de un campo desaparece en cuanto se corrige.
    if (errores[campo]) setErrores((e) => ({ ...e, [campo]: undefined }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const nuevos = validarContacto(datos);
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;
    setEstado('enviando');
    try {
      await enviarContacto(datos);
      setEstado('enviado');
    } catch {
      setEstado('error');
    }
  };

  if (estado === 'enviado') {
    return (
      <div style={{ textAlign: 'center', padding: '24px 8px 8px' }}>
        <div
          aria-hidden
          style={{
            width: 56,
            height: 56,
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            border: `2px solid ${COLORS.ok}`,
            color: COLORS.ok,
            fontSize: 26,
          }}
        >
          ✓
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>¡Mensaje enviado!</h2>
        <p style={{ marginTop: 8, fontSize: 14, color: COLORS.muted }}>
          Gracias, {datos.nombre.trim().split(' ')[0]}. Te responderé pronto a {datos.correo.trim()}.
        </p>
        <button
          type="button"
          onClick={onClose}
          autoFocus
          style={{
            ...buttonBase,
            marginTop: 22,
            border: `1px solid ${COLORS.accent}`,
            background: COLORS.accent,
            color: COLORS.background,
          }}
        >
          Volver a la escena
        </button>
      </div>
    );
  }

  const enviando = estado === 'enviando';

  return (
    <form onSubmit={onSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label htmlFor="contacto-nombre" style={labelStyle}>
            Nombre
          </label>
          <input
            id="contacto-nombre"
            autoFocus
            autoComplete="name"
            maxLength={MAX_LONGITUD.nombre}
            value={datos.nombre}
            onChange={(e) => set('nombre')(e.target.value)}
            aria-invalid={!!errores.nombre}
            style={fieldStyle(errores.nombre)}
          />
          {errores.nombre && <div style={errorStyle}>{errores.nombre}</div>}
        </div>
        <div>
          <label htmlFor="contacto-correo" style={labelStyle}>
            Correo
          </label>
          <input
            id="contacto-correo"
            type="email"
            autoComplete="email"
            maxLength={MAX_LONGITUD.correo}
            value={datos.correo}
            onChange={(e) => set('correo')(e.target.value)}
            aria-invalid={!!errores.correo}
            style={fieldStyle(errores.correo)}
          />
          {errores.correo && <div style={errorStyle}>{errores.correo}</div>}
        </div>
      </div>

      <div>
        <label htmlFor="contacto-asunto" style={labelStyle}>
          Asunto <span style={{ fontWeight: 400 }}>(opcional)</span>
        </label>
        <input
          id="contacto-asunto"
          maxLength={MAX_LONGITUD.asunto}
          value={datos.asunto}
          onChange={(e) => set('asunto')(e.target.value)}
          style={fieldStyle()}
        />
      </div>

      <div>
        <label htmlFor="contacto-mensaje" style={labelStyle}>
          Mensaje
        </label>
        <textarea
          id="contacto-mensaje"
          rows={5}
          maxLength={MAX_LONGITUD.mensaje}
          value={datos.mensaje}
          onChange={(e) => set('mensaje')(e.target.value)}
          aria-invalid={!!errores.mensaje}
          style={{ ...fieldStyle(errores.mensaje), resize: 'vertical', minHeight: 110 }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={errorStyle}>{errores.mensaje}</span>
          <span style={{ marginTop: 4, fontFamily: MONO, fontSize: 11, color: COLORS.muted }}>
            {datos.mensaje.length}/{MAX_LONGITUD.mensaje}
          </span>
        </div>
      </div>

      {estado === 'error' && (
        <div style={errorStyle}>No se pudo enviar el mensaje. Inténtalo de nuevo.</div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            ...buttonBase,
            border: `1px solid ${COLORS.border}`,
            background: 'transparent',
            color: COLORS.muted,
          }}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={enviando}
          style={{
            ...buttonBase,
            border: `1px solid ${COLORS.accent}`,
            background: COLORS.accent,
            color: COLORS.background,
            opacity: enviando ? 0.7 : 1,
            cursor: enviando ? 'wait' : 'pointer',
          }}
        >
          {enviando ? 'Enviando…' : 'Enviar mensaje'}
        </button>
      </div>
    </form>
  );
};

export default ContactoForm;
