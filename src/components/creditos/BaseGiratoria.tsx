import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Box3, Vector3, type Group } from 'three';
import AutoGLTF from '../physics/AutoGLTF';
import { LapizVisual } from '../3d-models/Lapiz';
import { amarillos, azulGrisOscuro } from '../../helpers/paleta-colores';
import type { CreditoModelo } from '../../data/creditos';

/** Radio y alto de la base circular (m). */
const BASE_RADIUS = 0.75;
const BASE_HEIGHT = 0.06;
/** Mayor dimensión del modelo una vez normalizado (m). */
const MODEL_SIZE = 1;
/** Velocidad de giro de la base (rad/s). */
const SPIN_SPEED = 0.6;
/** Rapidez del crecimiento al cambiar de modelo (1/s). */
const POP_SPEED = 8;

const CAMERA_POSITION: [number, number, number] = [0, 1.1, 2.6];
const CAMERA_TARGET = new Vector3(0, 0.4, 0);

/**
 * Modelo escalado para que su mayor dimensión mida `MODEL_SIZE`,
 * centrado en el eje de giro y apoyado sobre la base. (El centrado se
 * calcula a mano con la caja del `.glb`: `<Center>` de drei mediría el
 * modelo ya escalado a 0 por la animación.) Al montarse crece desde 0,
 * así el cambio de modelo en el carrusel no es un salto seco.
 *
 * Usa el mismo caché de `useGLTF` que la escena: los modelos ya están
 * cargados. El lápiz se pinta con `LapizVisual` para que tenga color
 * (su cuerpo no trae material propio).
 */
const ModeloNormalizado = ({ modelo }: { modelo: CreditoModelo }) => {
  const gltf = useGLTF(modelo.url);
  const groupRef = useRef<Group>(null);
  const progress = useRef(0);

  const { scale, offset } = useMemo(() => {
    gltf.scene.updateMatrixWorld(true);
    const box = new Box3().setFromObject(gltf.scene);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    return {
      scale: MODEL_SIZE / Math.max(size.x, size.y, size.z, 1e-6),
      offset: [-center.x, -box.min.y, -center.z] as [number, number, number],
    };
  }, [gltf]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group || progress.current >= 1) return;
    progress.current = Math.min(1, progress.current + delta * POP_SPEED * (1 - progress.current + 0.1));
    group.scale.setScalar(scale * progress.current);
  });

  return (
    <group ref={groupRef} position={[0, BASE_HEIGHT, 0]} rotation={modelo.rotacion} scale={0}>
      <group position={offset}>
        {modelo.url.endsWith('lapiz.glb') ? (
          <LapizVisual paleta="amarillos" intensidad={500} />
        ) : (
          <AutoGLTF url={modelo.url} />
        )}
      </group>
    </group>
  );
};

/** Base circular con aro de acento; gira junto con el modelo. */
const Plataforma = ({ modelo }: { modelo: CreditoModelo }) => {
  const spinRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (spinRef.current) spinRef.current.rotation.y += delta * SPIN_SPEED;
  });

  return (
    <group ref={spinRef}>
      <mesh receiveShadow position={[0, BASE_HEIGHT / 2, 0]}>
        <cylinderGeometry args={[BASE_RADIUS, BASE_RADIUS, BASE_HEIGHT, 64]} />
        <meshStandardMaterial color={azulGrisOscuro[300]} roughness={0.7} />
      </mesh>
      <mesh position={[0, BASE_HEIGHT, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[BASE_RADIUS - 0.01, 0.012, 12, 96]} />
        <meshStandardMaterial
          color={amarillos[500]}
          emissive={amarillos[500]}
          emissiveIntensity={0.4}
        />
      </mesh>
      <Suspense fallback={null}>
        {/* `key`: cada modelo se monta de nuevo y repite el crecimiento. */}
        <ModeloNormalizado key={modelo.url} modelo={modelo} />
      </Suspense>
    </group>
  );
};

/**
 * Visor 3D del carrusel de créditos: el modelo activo girando sobre una
 * base circular.
 *
 * Es un `<Canvas>` propio (fondo transparente, se ve la tarjeta del
 * modal) que solo existe mientras la ventana de créditos está abierta.
 */
const BaseGiratoria = ({ modelo }: { modelo: CreditoModelo }) => (
  <Canvas
    shadows
    dpr={[1, 1.5]}
    camera={{ position: CAMERA_POSITION, fov: 35 }}
    onCreated={({ camera }) => camera.lookAt(CAMERA_TARGET)}
    gl={{ alpha: true }}
  >
    <ambientLight intensity={1.2} />
    <directionalLight
      castShadow
      position={[2, 4, 3]}
      intensity={2.2}
      shadow-mapSize={[1024, 1024]}
    />
    <directionalLight position={[-3, 2, -2]} intensity={0.6} color={amarillos[100]} />
    <Plataforma modelo={modelo} />
  </Canvas>
);

export default BaseGiratoria;
