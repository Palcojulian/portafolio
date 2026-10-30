/**
 * Abre un enlace externo en una pestaña nueva.
 *
 * Se llama desde el manejador de Enter (`InteractionManager`), que es un
 * gesto del usuario, así que el navegador no lo bloquea como ventana
 * emergente. `noopener,noreferrer` impide que la página abierta acceda
 * a esta (`window.opener`).
 */
export const abrirEnlace = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};
