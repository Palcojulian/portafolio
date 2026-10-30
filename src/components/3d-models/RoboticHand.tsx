import { CuboidCollider } from '@react-three/rapier';
import AutoGLTF from '../physics/AutoGLTF';
import RigidObject from '../physics/RigidObject';
import { BULKY_DENSITY } from '../../helpers/density';
import { useGLTF } from '@react-three/drei';

/**
 * Cajas del collider compuesto, en unidades del modelo (el `scale` del
 * RigidBody también escala los colliders hijos). Cada una es la caja
 * envolvente de una franja de altura de la malla:
 *
 * - `foot`: placa de la base, a ras de mesa.
 * - `column`: columna del brazo hasta el codo.
 * - `arm`: codo y antebrazo, que sobresalen ~12 cm hacia −Z.
 * - `hand`: muñeca y dedos.
 *
 * Con una sola caja (`colliders="cuboid"`) el saliente del brazo
 * llegaba hasta la mesa y el vehículo chocaba con aire a varios
 * centímetros de la base.
 */
const PARTS = {
  foot: { min: [-0.048, 0, -0.08], max: [0.061, 0.078, 0.064] },
  column: { min: [-0.029, 0.078, -0.085], max: [0.045, 0.236, 0.049] },
  arm: { min: [-0.069, 0.236, -0.184], max: [0.051, 0.473, 0.096] },
  hand: { min: [-0.024, 0.473, -0.117], max: [0.039, 0.631, 0.106] },
} as const;

/**
 * Mano robótica. Cuerpo físico dinámico.
 *
 * El .glb tiene una única malla (`roboticHand`) y un material `Material`.
 * Usa un collider compuesto de 4 cajas (`PARTS`) que sigue el perfil
 * del brazo, para que el vehículo pueda llegar hasta la base.
 */
const Model = () => {
  return (
    <RigidObject
      type="dynamic"
      sound="metal"
      colliders={false}
      position={[-1.4, 1.48, -0.5]}
      scale={1.2}
      rotation={[0, -4.6, 0]}
    >
      <AutoGLTF url="/3d-models/roboticHand.glb" />
      {Object.entries(PARTS).map(([name, { min, max }]) => (
        <CuboidCollider
          key={name}
          args={[(max[0] - min[0]) / 2, (max[1] - min[1]) / 2, (max[2] - min[2]) / 2]}
          position={[(max[0] + min[0]) / 2, (max[1] + min[1]) / 2, (max[2] + min[2]) / 2]}
          density={BULKY_DENSITY}
        />
      ))}
    </RigidObject>
  );
};

useGLTF.preload('/3d-models/roboticHand.glb');

export default Model;
