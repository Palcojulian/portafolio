import { useRef, type RefObject } from 'react';
import type { CollisionEnterPayload, RapierRigidBody } from '@react-three/rapier';
import type { PlayerUserData } from '../components/player/Player';

/** Velocidad horizontal mínima (m/s) del personaje para que el golpe cuente. */
const MIN_SPEED = 0.3;
/**
 * Velocidad máxima que cuenta para el golpe. Sin límite, al correr
 * (2,2 m/s) el objeto sale despedido en vez de volcar.
 */
const MAX_SPEED = 1.5;
/** Tiempo mínimo entre dos golpes al mismo objeto. */
const COOLDOWN_MS = 300;
/**
 * Sólo se golpea si el objeto está de pie: su eje Y forma menos de
 * ~25° con la vertical. Una vez volcado, el contacto físico basta.
 */
const MIN_UPRIGHT = Math.cos((25 * Math.PI) / 180);

interface Options {
  bodyRef: RefObject<RapierRigidBody | null>;
  /** Impulso de giro por cada m/s del personaje. `undefined` = desactivado. */
  strength?: number;
}

/**
 * "Golpe" del personaje: al chocar con el objeto, le aplica un impulso
 * de giro que lo vuelca en la dirección en la que se movía el personaje.
 *
 * Hace falta porque el personaje se controla por velocidad y es bajo
 * (empuja casi a ras de la base): con sólo el contacto físico, los
 * objetos ligeros se deslizan por la mesa en lugar de volcar.
 *
 * El personaje se reconoce por `userData.kind === 'player'` en su
 * RigidBody, que además publica la velocidad que intenta llevar
 * (`PlayerUserData`).
 */
export const usePlayerKnock = ({ bodyRef, strength }: Options) => {
  const lastKnockAt = useRef(0);

  if (!strength) return undefined;

  return (e: CollisionEnterPayload) => {
    const body = bodyRef.current;
    const other = e.other.rigidBody;
    if (!body || !other) return;
    const player = other.userData as PlayerUserData | undefined;
    if (player?.kind !== 'player') return;

    // Velocidad que el personaje intentaba llevar (la real ya está frenada).
    const v = { x: player.vx, z: player.vz };
    const speed = Math.hypot(v.x, v.z);
    // Componente Y del eje Y local del objeto (1 = de pie, 0 = tumbado).
    const q = body.rotation();
    const upright = 1 - 2 * (q.x * q.x + q.z * q.z);
    const now = performance.now();
    if (upright < MIN_UPRIGHT) return;
    if (speed < MIN_SPEED || now - lastKnockAt.current < COOLDOWN_MS) return;
    lastKnockAt.current = now;

    // Eje de vuelco: up × dirección del golpe (horizontal). Girar sobre él
    // lleva la parte alta del objeto hacia donde iba el personaje.
    const k = strength * Math.min(speed, MAX_SPEED);
    body.applyTorqueImpulse({ x: (v.z / speed) * k, y: 0, z: (-v.x / speed) * k }, true);
  };
};
