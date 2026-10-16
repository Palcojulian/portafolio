import { useEffect, useRef } from 'react';
import type { Group, Material, Mesh } from 'three';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import type { Fragmento } from '../../helpers/fracturar';

/** Segundos que los fragmentos permanecen visibles antes de desvanecerse. */
const LIFETIME = 4;
/** Duración del desvanecimiento (s). */
const FADE = 1;

interface TazaRotaProps {
  /** Fragmentos calculados con `fracturar` en el momento del impacto. */
  fragmentos: Fragmento[];
  /** Material (transparente) compartido por todos los fragmentos. */
  material: Material;
  /** Se llama cuando los fragmentos han desaparecido. */
  onDone: () => void;
}

/**
 * Fragmentos de la taza rota.
 *
 * Cada fragmento es un RigidBody dinámico con collider `hull`. A los
 * `LIFETIME` segundos se desvanecen y se avisa con `onDone`. Al
 * desmontarse liberan sus geometrías y el material.
 */
const TazaRota = ({ fragmentos, material, onDone }: TazaRotaProps) => {
  const groupRef = useRef<Group>(null);
  const elapsed = useRef(0);
  const done = useRef(false);

  useEffect(
    () => () => {
      fragmentos.forEach((f) => f.geometry.dispose());
      material.dispose();
    },
    [fragmentos, material]
  );

  useFrame((_, delta) => {
    if (done.current) return;
    elapsed.current += delta;
    if (elapsed.current < LIFETIME) return;

    const opacity = Math.max(0, 1 - (elapsed.current - LIFETIME) / FADE);
    groupRef.current?.traverse((obj) => {
      const mat = (obj as Mesh).material as Material | undefined;
      if (mat) mat.opacity = opacity;
    });
    if (opacity === 0) {
      done.current = true;
      onDone();
    }
  });

  return (
    <group ref={groupRef}>
      {fragmentos.map((f, i) => (
        <RigidBody
          key={i}
          type="dynamic"
          colliders="hull"
          position={f.position.toArray()}
          quaternion={f.quaternion.toArray() as [number, number, number, number]}
          linearVelocity={f.velocity.toArray()}
        >
          <mesh castShadow receiveShadow geometry={f.geometry} material={material} />
        </RigidBody>
      ))}
    </group>
  );
};

export default TazaRota;
