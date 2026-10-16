import { useState } from 'react';
import { Quaternion, Vector3, type Material, type MeshStandardMaterial } from 'three';
import AutoGLTF from '../physics/AutoGLTF';
import RigidObject from '../physics/RigidObject';
import TazaRota from './TazaRota';
import { useGLTF } from '@react-three/drei';
import { playShatter } from '../../audio/sound';
import { fracturar, type Fragmento } from '../../helpers/fracturar';
import type { FloorImpact } from '../../hooks/useFloorImpact';

const POSITION: [number, number, number] = [-2.2, 1.48, 0.56];
const SCALE = 0.6;
/**
 * Velocidad vertical (m/s) a partir de la cual la taza se rompe al
 * golpear el suelo. Caer desde el escritorio da ≈ 6 m/s; un golpe
 * suave sólo hace "clink".
 */
const BREAK_SPEED = 3.5;

interface BreakInfo {
  fragmentos: Fragmento[];
  material: Material;
}

/**
 * Taza. Cuerpo físico dinámico y **rompible**.
 *
 * El .glb tiene una única malla (`tazaModel`) y 2 materiales
 * (`baseMaterial`, `secondaryMaterial`).
 *
 * Si golpea el suelo a más de `BREAK_SPEED` se fractura con
 * `fracturar` (helpers) y se sustituye por `<TazaRota>` (fragmentos
 * físicos). Cuando los fragmentos se
 * desvanecen, la taza reaparece entera en su posición inicial; el
 * contador `generation` fuerza a montar un RigidBody nuevo.
 */
const Model = () => {
  const { scene, materials } = useGLTF('/3d-models/taza.glb');
  const [broken, setBroken] = useState<BreakInfo | null>(null);
  const [generation, setGeneration] = useState(0);

  const handleFloorImpact = ({ speed, body }: FloorImpact) => {
    if (speed < BREAK_SPEED) return;
    const t = body.translation();
    const r = body.rotation();
    const v = body.linvel();
    playShatter(0.6 + (speed - BREAK_SPEED) / 5);

    const material = (materials.baseMaterial as MeshStandardMaterial).clone();
    material.transparent = true;
    setBroken({
      fragmentos: fracturar(scene, SCALE, {
        position: new Vector3(t.x, t.y, t.z),
        quaternion: new Quaternion(r.x, r.y, r.z, r.w),
        velocity: new Vector3(v.x, v.y, v.z),
      }),
      material,
    });
  };

  if (broken) {
    return (
      <TazaRota
        {...broken}
        onDone={() => {
          setBroken(null);
          setGeneration((g) => g + 1);
        }}
      />
    );
  }

  return (
    <RigidObject
      key={generation}
      type="dynamic"
      sound="ceramic"
      colliders="cuboid"
      position={POSITION}
      scale={SCALE}
      onFloorImpact={handleFloorImpact}
    >
      <AutoGLTF url="/3d-models/taza.glb" />
    </RigidObject>
  );
};

useGLTF.preload('/3d-models/taza.glb');

export default Model;
