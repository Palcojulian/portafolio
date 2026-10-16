import type { Mesh } from 'three';
import { useGLTF } from '@react-three/drei';
import {
  paletaColores,
  type NombrePaleta,
  type IntensidadColor,
} from '../../helpers/paleta-colores';
import { CapsuleCollider } from '@react-three/rapier';
import RigidObject from '../physics/RigidObject';
import {
  PENCIL_CENTER_Y,
  PENCIL_HALF_HEIGHT,
  PENCIL_RADIUS,
  PENCIL_SCALE,
  PENCIL_SOLVER_ITERATIONS,
} from './lapizShape';

type Vec3 = [number, number, number];

interface VisualProps {
  paleta: NombrePaleta;
  intensidad: IntensidadColor;
}

/**
 * Mallas del lápiz (sin físicas), a escala 1 del modelo.
 *
 * El .glb tiene 5 mallas (`baseBorrador`, `borradorLapiz`,
 * `cuerpoLapiz`, `minaLapiz`, `puntaLapiz`) y 5 materiales. El
 * material del cuerpo se sustituye por uno con el color de la paleta.
 *
 * Lo usan el lápiz dinámico (`Lapiz`) y los lápices que van pegados al
 * portalápices mientras está de pie (`PortaLapiceros`).
 */
export const LapizVisual = ({ paleta, intensidad }: VisualProps) => {
  const { nodes, materials } = useGLTF('/3d-models/lapiz.glb');

  return (
    <>
      {/* Las piezas diminutas (virola y mina) no proyectan sombra: ahorran
          draw calls en el pase de sombras sin diferencia visible. */}
      <mesh
        receiveShadow
        geometry={(nodes.baseBorrador as Mesh).geometry}
        material={materials.baseBorrador}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.borradorLapiz as Mesh).geometry}
        material={materials.borradorMaterial}
      />
      <mesh castShadow receiveShadow geometry={(nodes.cuerpoLapiz as Mesh).geometry}>
        <meshStandardMaterial color={paletaColores[paleta][intensidad]} />
      </mesh>
      <mesh
        receiveShadow
        geometry={(nodes.minaLapiz as Mesh).geometry}
        material={materials.minaLapizMaterial}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.puntaLapiz as Mesh).geometry}
        material={materials.puntaLapizMaterial}
      />
    </>
  );
};

interface Props extends VisualProps {
  position: Vec3;
  rotation?: Vec3;
  quaternion?: [number, number, number, number];
  /** Velocidades iniciales (p. ej. al salir despedido del portalápices). */
  linearVelocity?: Vec3;
  angularVelocity?: Vec3;
}

/**
 * Lápiz dinámico: cae, rueda y el personaje puede empujarlo.
 *
 * Collider: cápsula a lo largo del eje del lápiz (redonda, rueda y
 * resbala en vez de encajarse por las esquinas), con fricción 0 porque
 * Rapier la promedia con la del otro collider (ver `PortaLapiceros`).
 * El cuerpo no lleva `scale`: la cápsula usa medidas ya escaladas
 * (`lapizShape.ts`) y sólo la parte visual se escala.
 */
const Model = ({
  paleta,
  intensidad,
  position,
  rotation,
  quaternion,
  linearVelocity,
  angularVelocity,
}: Props) => (
  <RigidObject
    type="dynamic"
    sound="wood"
    ccd
    additionalSolverIterations={PENCIL_SOLVER_ITERATIONS}
    colliders={false}
    position={position}
    rotation={rotation}
    quaternion={quaternion}
    linearVelocity={linearVelocity}
    angularVelocity={angularVelocity}
  >
    <CapsuleCollider
      args={[PENCIL_HALF_HEIGHT, PENCIL_RADIUS]}
      position={[0, PENCIL_CENTER_Y, 0]}
      friction={0}
    />
    <group scale={PENCIL_SCALE}>
      <LapizVisual paleta={paleta} intensidad={intensidad} />
    </group>
  </RigidObject>
);

useGLTF.preload('/3d-models/lapiz.glb');

export default Model;
