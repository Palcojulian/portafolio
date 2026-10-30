import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  AdditiveBlending,
  Box3,
  CanvasTexture,
  Vector3,
  type Group,
  type Mesh,
  type MeshBasicMaterial,
  type Object3D,
  type Sprite,
  type SpriteMaterial,
} from 'three';
import { coloresUI } from '../../helpers/colores-ui';
import {
  getActive,
  getLastInteractAt,
  register,
  type Interactable,
} from '../../helpers/interaccion';

/** Altura del orbe sobre el punto más alto del objeto (m). */
const HOVER_HEIGHT = 0.06;
/** Radio de la órbita: proporcional al objeto, con límites (m). */
const MIN_ORBIT = 0.06;
const MAX_ORBIT = 0.18;
/** Velocidad de giro (rad/s) en reposo y con el vehículo cerca. */
const IDLE_SPEED = 0.7;
const ACTIVE_SPEED = 1.8;
/** Opacidad del núcleo y del halo en reposo / activo. */
const IDLE_OPACITY = { core: 0.75, halo: 0.3 };
const ACTIVE_OPACITY = { core: 1, halo: 0.55 };
/** Duración del destello al pulsar Enter (ms). */
const FLASH_MS = 450;

let haloTexture: CanvasTexture | null = null;

/** Degradado radial blanco → transparente, compartido por todos los halos. */
const getHaloTexture = () => {
  if (haloTexture) return haloTexture;
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(255,255,255,0.35)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  haloTexture = new CanvasTexture(canvas);
  return haloTexture;
};

const noRaycast = () => {};

/** Ángulo inicial derivado del id, para que los orbes no vayan sincronizados. */
const startAngle = (id: string) =>
  ([...id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7) % 628) / 100;

interface InteractionHelperProps {
  id: string;
  label: string;
  /** Grupo con las mallas del objeto (dentro de su RigidBody). */
  target: RefObject<Object3D | null>;
  onInteract?: () => void;
}

/**
 * Orbe de luz que orbita sobre un objeto interactivo para llamar la
 * atención sin tapar nada.
 *
 * Se monta **fuera** del RigidBody (como hermano), para no generar
 * colliders automáticos ni girar con el objeto: cada fotograma lee la
 * caja envolvente en mundo de `target` y coloca la órbita sobre su
 * punto más alto, así sigue al objeto aunque lo empujen o vuelque.
 *
 * Es solo un material básico aditivo (sin luz real): en reposo es tenue
 * y lento; cuando el vehículo está cerca (`InteractionManager` lo marca
 * como activo) brilla más y gira más rápido, y destella al pulsar Enter.
 */
const InteractionHelper = ({ id, label, target, onInteract }: InteractionHelperProps) => {
  const orbRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);
  const haloRef = useRef<Sprite>(null);
  const angle = useRef(startAngle(id));
  const onInteractRef = useRef(onInteract);
  const glow = useRef(0);

  const item = useMemo<Interactable>(
    () => ({
      id,
      label,
      box: new Box3(),
      anchor: new Vector3(),
      onInteract: () => (onInteractRef.current ? onInteractRef.current() : false),
    }),
    [id, label]
  );

  useEffect(() => register(item), [item]);
  // La acción va por ref: cambiarla no vuelve a registrar el objeto.
  useEffect(() => {
    onInteractRef.current = onInteract;
  }, [onInteract]);

  const center = useMemo(() => new Vector3(), []);
  const size = useMemo(() => new Vector3(), []);

  useFrame((_, delta) => {
    const object = target.current;
    const orb = orbRef.current;
    if (!object || !orb) return;

    item.box.setFromObject(object);
    if (item.box.isEmpty()) return;
    item.box.getCenter(center);
    item.box.getSize(size);

    const isActive = getActive() === item;
    glow.current += ((isActive ? 1 : 0) - glow.current) * Math.min(1, delta * 6);
    const g = glow.current;

    angle.current += delta * (IDLE_SPEED + (ACTIVE_SPEED - IDLE_SPEED) * g);
    const radius = Math.min(MAX_ORBIT, Math.max(MIN_ORBIT, Math.max(size.x, size.z) * 0.45));
    const bob = Math.sin(angle.current * 1.7) * 0.008;
    orb.position.set(
      center.x + Math.cos(angle.current) * radius,
      item.box.max.y + HOVER_HEIGHT + bob,
      center.z + Math.sin(angle.current) * radius
    );
    item.anchor.copy(orb.position);

    const since = performance.now() - getLastInteractAt();
    const flash = isActive && since < FLASH_MS ? 1 - since / FLASH_MS : 0;
    orb.scale.setScalar(1 + g * 0.3 + flash * 1.2);

    const core = coreRef.current?.material as MeshBasicMaterial | undefined;
    const halo = haloRef.current?.material as SpriteMaterial | undefined;
    if (core) core.opacity = IDLE_OPACITY.core + (ACTIVE_OPACITY.core - IDLE_OPACITY.core) * g;
    if (halo) halo.opacity = IDLE_OPACITY.halo + (ACTIVE_OPACITY.halo - IDLE_OPACITY.halo) * g + flash * 0.4;
  });

  return (
    <group ref={orbRef}>
      <mesh ref={coreRef} raycast={noRaycast}>
        <sphereGeometry args={[0.014, 12, 12]} />
        <meshBasicMaterial
          color={coloresUI.accent}
          transparent
          opacity={IDLE_OPACITY.core}
          toneMapped={false}
        />
      </mesh>
      <sprite ref={haloRef} scale={0.14} raycast={noRaycast}>
        <spriteMaterial
          map={getHaloTexture()}
          color={coloresUI.accent}
          transparent
          opacity={IDLE_OPACITY.halo}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </sprite>
    </group>
  );
};

export default InteractionHelper;
