import { Box3, Vector3 } from 'three';

/**
 * Estado compartido de los objetos interactivos del escritorio.
 *
 * - Cada `InteractionHelper` registra su objeto y actualiza cada
 *   fotograma su caja envolvente en mundo (`box`).
 * - `DrivableVehicle` copia su posición en `playerPosition`.
 * - `InteractionManager` elige el objeto más cercano al vehículo
 *   (`setActive`) y, al pulsar Enter, llama a `interact`.
 * - `InteractionPrompt` (HTML, fuera del `<Canvas>`) se suscribe con
 *   `subscribe` / `getActive` para mostrar "Enter · Interactuar".
 *
 * Es un módulo plano (sin React) para poder leerlo desde `useFrame` sin
 * provocar renders.
 */
export interface Interactable {
  id: string;
  /** Nombre visible en el aviso ("Taza", "Reloj"…). */
  label: string;
  /** Caja envolvente en mundo, actualizada por el helper. */
  box: Box3;
  /** Posición en mundo del orbe (para colocar la luz del activo). */
  anchor: Vector3;
  /** Acción al pulsar Enter. Devuelve `false` si el objeto aún no tiene acción. */
  onInteract: () => boolean | void;
}

/** Posición del vehículo en mundo (la escribe `DrivableVehicle`). */
export const playerPosition = new Vector3(Infinity, Infinity, Infinity);

const registry = new Map<string, Interactable>();
let active: Interactable | null = null;
/** Momento (`performance.now()`) del último Enter, para el destello. */
let lastInteractAt = 0;
const listeners = new Set<() => void>();

export const register = (item: Interactable) => {
  registry.set(item.id, item);
  return () => {
    registry.delete(item.id);
    if (active?.id === item.id) setActive(null);
  };
};

export const interactables = () => registry.values();

export const getActive = () => active;

export const setActive = (item: Interactable | null) => {
  if (item === active) return;
  active = item;
  listeners.forEach((l) => l());
};

export const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const getLastInteractAt = () => lastInteractAt;

/** Ejecuta la acción del objeto activo (si hay uno). */
export const interact = () => {
  if (!active) return;
  lastInteractAt = performance.now();
  if (active.onInteract() === false) {
    console.info(`[interacción] "${active.label}" aún no tiene acción.`);
  }
};
