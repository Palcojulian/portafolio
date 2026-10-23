import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, type PointLight } from 'three';
import { coloresUI } from '../../helpers/colores-ui';
import {
  getActive,
  interact,
  interactables,
  playerPosition,
  setActive,
  type Interactable,
} from '../../helpers/interaccion';

/**
 * Distancia horizontal (m) del centro del vehículo a la caja del objeto
 * para poder interactuar. El coche mide ~40 cm, así que con 0,3 basta
 * con acercar el morro.
 */
const NEAR_DISTANCE = 0.3;
/** Margen extra para soltar el objeto activo (evita parpadeos en el borde). */
const RELEASE_MARGIN = 0.05;
/** Intensidad de la luz que acompaña al orbe activo. */
const LIGHT_INTENSITY = 0.08;

/** Distancia en el plano XZ de un punto a una caja (0 si está dentro). */
const horizontalDistance = (item: Interactable, p: Vector3) => {
  const { min, max } = item.box;
  const dx = Math.max(min.x - p.x, 0, p.x - max.x);
  const dz = Math.max(min.z - p.z, 0, p.z - max.z);
  return Math.hypot(dx, dz);
};

/**
 * Elige el objeto interactivo más cercano al vehículo y gestiona Enter.
 *
 * Va dentro del `<Canvas>`. Tiene **una sola** `pointLight` que sigue
 * al orbe activo y se apaga (intensidad 0) cuando no hay ninguno:
 * montar y desmontar luces obligaría a three.js a recompilar todos los
 * materiales.
 */
const InteractionManager = () => {
  const lightRef = useRef<PointLight>(null);
  const target = useMemo(() => new Vector3(), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Enter' && e.code !== 'NumpadEnter') return;
      if (e.repeat) return;
      // No robar el Enter a botones o campos de texto.
      const el = e.target as HTMLElement | null;
      if (el && ['BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)) return;
      interact();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useFrame((_, delta) => {
    const current = getActive();
    let nearest: Interactable | null = null;
    let best = Infinity;
    for (const item of interactables()) {
      if (item.box.isEmpty()) continue;
      const d = horizontalDistance(item, playerPosition);
      const limit = NEAR_DISTANCE + (item === current ? RELEASE_MARGIN : 0);
      if (d < limit && d < best) {
        best = d;
        nearest = item;
      }
    }
    setActive(nearest);

    const light = lightRef.current;
    if (!light) return;
    if (nearest) {
      target.copy(nearest.anchor);
      // Al aparecer salta al orbe; después lo sigue suavemente.
      if (light.intensity === 0) light.position.copy(target);
      else light.position.lerp(target, Math.min(1, delta * 12));
    }
    const goal = nearest ? LIGHT_INTENSITY : 0;
    light.intensity += (goal - light.intensity) * Math.min(1, delta * 6);
    if (light.intensity < 0.001) light.intensity = 0;
  });

  return (
    <pointLight
      ref={lightRef}
      color={coloresUI.accent}
      intensity={0}
      distance={0.35}
      decay={2}
    />
  );
};

export default InteractionManager;
