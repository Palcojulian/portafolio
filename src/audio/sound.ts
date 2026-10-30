/**
 * Motor de sonido de la escena.
 *
 * Todos los sonidos se **sintetizan** con Web Audio (no hay archivos):
 * cada material combina tonos y ruido filtrado con envolventes cortas.
 * Para pasar a archivos de audio bastaría con reemplazar el cuerpo de
 * `playImpact` por la reproducción de un `AudioBuffer`.
 *
 * Los navegadores bloquean el audio hasta la primera interacción del
 * usuario: `installAudioUnlock()` reanuda el `AudioContext` en el primer
 * `pointerdown` / `keydown`.
 */

export type SoundMaterial = 'ceramic' | 'plastic' | 'metal' | 'wood';

const STORAGE_KEY = 'sound-muted';
const MASTER_VOLUME = 0.6;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuffer: AudioBuffer | null = null;
let muted = readMuted();
const listeners = new Set<(muted: boolean) => void>();

function readMuted(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

const getContext = (): AudioContext | null => {
  if (ctx) return ctx;
  if (typeof AudioContext === 'undefined') return null;
  ctx = new AudioContext();
  master = ctx.createGain();
  master.gain.value = muted ? 0 : MASTER_VOLUME;
  master.connect(ctx.destination);

  // Un segundo de ruido blanco, reutilizado por todos los sonidos.
  noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return ctx;
};

/** Reanuda el audio en el primer gesto del usuario. */
export const installAudioUnlock = (): void => {
  const unlock = () => {
    void getContext()?.resume();
    window.removeEventListener('pointerdown', unlock);
    window.removeEventListener('keydown', unlock);
  };
  window.addEventListener('pointerdown', unlock);
  window.addEventListener('keydown', unlock);
};

export const isMuted = (): boolean => muted;

export const setMuted = (value: boolean): void => {
  muted = value;
  if (master && ctx) master.gain.setTargetAtTime(value ? 0 : MASTER_VOLUME, ctx.currentTime, 0.02);
  try {
    localStorage.setItem(STORAGE_KEY, value ? '1' : '0');
  } catch {
    // Almacenamiento no disponible: el estado sólo dura la sesión.
  }
  listeners.forEach((l) => l(value));
};

/** Suscripción a cambios de silencio (para la UI). Devuelve la baja. */
export const onMutedChange = (listener: (muted: boolean) => void): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** Contexto listo para sonar, o `null` si está silenciado / bloqueado. */
const ready = (): AudioContext | null => {
  if (muted) return null;
  const c = getContext();
  if (!c || c.state !== 'running') return null;
  return c;
};

const vary = (value: number, amount = 0.1): number =>
  value * (1 + (Math.random() * 2 - 1) * amount);

/** Envolvente percusiva: ataque casi instantáneo y caída exponencial. */
const envelope = (c: AudioContext, start: number, peak: number, decay: number): GainNode => {
  const g = c.createGain();
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(peak, start + 0.003);
  g.gain.exponentialRampToValueAtTime(0.0001, start + decay);
  g.connect(master!);
  return g;
};

const tone = (
  c: AudioContext,
  start: number,
  freq: number,
  peak: number,
  decay: number,
  type: OscillatorType = 'sine'
): void => {
  const osc = c.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(envelope(c, start, peak, decay));
  osc.start(start);
  osc.stop(start + decay + 0.02);
};

const noise = (
  c: AudioContext,
  start: number,
  filterType: BiquadFilterType,
  freq: number,
  q: number,
  peak: number,
  decay: number
): void => {
  const src = c.createBufferSource();
  src.buffer = noiseBuffer;
  const filter = c.createBiquadFilter();
  filter.type = filterType;
  filter.frequency.value = freq;
  filter.Q.value = q;
  src.connect(filter);
  filter.connect(envelope(c, start, peak, decay));
  src.start(start, Math.random() * 0.5);
  src.stop(start + decay + 0.02);
};

/** Recetas por material. `v` es el volumen (0–1). */
const recipes: Record<SoundMaterial, (c: AudioContext, t: number, v: number) => void> = {
  ceramic: (c, t, v) => {
    const base = vary(2400);
    tone(c, t, base, 0.25 * v, 0.18);
    tone(c, t, base * 1.53, 0.15 * v, 0.12);
    tone(c, t, base * 2.71, 0.08 * v, 0.08);
    noise(c, t, 'highpass', 3000, 0.7, 0.3 * v, 0.03);
  },
  plastic: (c, t, v) => {
    noise(c, t, 'bandpass', vary(1200), 1.2, 0.8 * v, 0.07);
    tone(c, t, vary(180), 0.35 * v, 0.06, 'triangle');
  },
  metal: (c, t, v) => {
    const base = vary(620);
    tone(c, t, base, 0.18 * v, 0.45);
    tone(c, t, base * 2.76, 0.1 * v, 0.35);
    tone(c, t, base * 5.4, 0.05 * v, 0.2);
    noise(c, t, 'bandpass', 4000, 1, 0.25 * v, 0.03);
  },
  wood: (c, t, v) => {
    noise(c, t, 'lowpass', vary(900), 1, 0.7 * v, 0.06);
    tone(c, t, vary(320), 0.3 * v, 0.08, 'triangle');
  },
};

/**
 * Sonido de impacto.
 * @param intensity - 0 (roce) a 1 (golpe fuerte).
 */
export const playImpact = (material: SoundMaterial, intensity: number): void => {
  const c = ready();
  if (!c) return;
  const v = Math.min(1, Math.max(0.05, intensity));
  recipes[material](c, c.currentTime, v);
};
