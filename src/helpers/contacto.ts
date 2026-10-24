/**
 * Formulario de contacto (modal del portalápices): datos, validación y
 * envío.
 *
 * ⚠️ Sin backend todavía: `enviarContacto` solo **captura** el mensaje
 * (lo guarda en `enviosContacto` y lo muestra en consola). Para recibirlo
 * de verdad, sustituir su cuerpo por la llamada al servicio elegido
 * (Formspree, EmailJS, una API propia…); el modal no cambia.
 */
export interface ContactoDatos {
  nombre: string;
  correo: string;
  asunto: string;
  mensaje: string;
}

export type ContactoErrores = Partial<Record<keyof ContactoDatos, string>>;

export const CONTACTO_VACIO: ContactoDatos = { nombre: '', correo: '', asunto: '', mensaje: '' };

/** Longitudes máximas (también como `maxLength` en los campos). */
export const MAX_LONGITUD = { nombre: 80, correo: 120, asunto: 120, mensaje: 2000 } as const;

const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Devuelve un mensaje por cada campo inválido (vacío = todo correcto). */
export const validarContacto = (d: ContactoDatos): ContactoErrores => {
  const errores: ContactoErrores = {};
  if (d.nombre.trim().length < 2) errores.nombre = 'Escribe tu nombre.';
  if (!CORREO_VALIDO.test(d.correo.trim())) errores.correo = 'Escribe un correo válido.';
  if (d.mensaje.trim().length < 10) errores.mensaje = 'El mensaje debe tener al menos 10 caracteres.';
  return errores;
};

export interface EnvioContacto extends ContactoDatos {
  /** Fecha del envío en ISO 8601. */
  fecha: string;
}

/** Mensajes capturados en esta sesión (en memoria). */
export const enviosContacto: EnvioContacto[] = [];

/**
 * Envía (por ahora, captura) un mensaje ya validado. Es asíncrona para
 * que el modal no cambie el día que se conecte a un servicio real.
 */
export const enviarContacto = async (datos: ContactoDatos): Promise<void> => {
  const envio: EnvioContacto = {
    nombre: datos.nombre.trim(),
    correo: datos.correo.trim(),
    asunto: datos.asunto.trim(),
    mensaje: datos.mensaje.trim(),
    fecha: new Date().toISOString(),
  };
  enviosContacto.push(envio);
  console.info('[contacto] mensaje capturado:', envio);
};
