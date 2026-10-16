import { useRef, type RefObject } from 'react';
import {
  useBeforePhysicsStep,
  type CollisionEnterPayload,
  type RapierRigidBody,
} from '@react-three/rapier';
import { playImpact, type SoundMaterial } from '../audio/sound';

/** Por debajo de esta velocidad vertical (m/s) el contacto no suena. */
const MIN_IMPACT_SPEED = 1;
/** Velocidad a partir de la cual el golpe suena a volumen máximo. */
const MAX_IMPACT_SPEED = 7;
/** Tiempo mínimo entre dos sonidos del mismo objeto (rebotes). */
const COOLDOWN_MS = 150;

export interface FloorImpact {
  /** Velocidad vertical justo antes del choque (m/s, positiva). */
  speed: number;
  body: RapierRigidBody;
}

interface Options {
  bodyRef: RefObject<RapierRigidBody | null>;
  enabled: boolean;
  sound?: SoundMaterial;
  onFloorImpact?: (impact: FloorImpact) => void;
}

/**
 * Detecta cuándo un RigidBody golpea el suelo (`userData.surface ===
 * 'floor'`), reproduce el sonido de su material y avisa al componente.
 *
 * Antes de cada paso de física se acumula la **máxima velocidad de
 * caída desde la última colisión**. No basta con leer la velocidad en
 * `onCollisionEnter`: Rapier ya ha resuelto el contacto, y con FPS
 * bajos se ejecutan varios pasos por fotograma antes de entregar los
 * eventos, así que la última velocidad sería la de después del choque.
 */
export const useFloorImpact = ({ bodyRef, enabled, sound, onFloorImpact }: Options) => {
  const peakFallSpeed = useRef(0);
  const lastImpactAt = useRef(0);

  useBeforePhysicsStep(() => {
    const body = bodyRef.current;
    if (!enabled || !body) return;
    peakFallSpeed.current = Math.max(peakFallSpeed.current, -body.linvel().y);
  });

  const onCollisionEnter = (e: CollisionEnterPayload) => {
    const body = bodyRef.current;
    if (!enabled || !body) return;
    // `userData` de <RigidBody> se guarda en el cuerpo de Rapier, no en el Object3D.
    const surface = (e.other.rigidBody?.userData as { surface?: string } | undefined)?.surface;
    const speed = peakFallSpeed.current;
    // Cualquier contacto nuevo cierra la caída actual.
    peakFallSpeed.current = 0;
    if (surface !== 'floor') return;

    const now = performance.now();
    if (speed < MIN_IMPACT_SPEED || now - lastImpactAt.current < COOLDOWN_MS) return;
    lastImpactAt.current = now;

    if (sound) {
      playImpact(
        sound,
        (speed - MIN_IMPACT_SPEED) / (MAX_IMPACT_SPEED - MIN_IMPACT_SPEED)
      );
    }
    onFloorImpact?.({ speed, body });
  };

  return enabled ? onCollisionEnter : undefined;
};
