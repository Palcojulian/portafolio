import type { Mesh } from 'three';
import { useGLTF } from '@react-three/drei';
import type { JSX } from 'react';
import {
  paletaColores,
  type NombrePaleta,
  type IntensidadColor,
} from '../../helpers/paleta-colores';
import RigidObject from '../physics/RigidObject';

/**
 * Lápiz. Componente reutilizable: cada instancia se puede colorear
 * dinámicamente con una gama e intensidad de la paleta.
 *
 * Es un cuerpo físico dinámico: cae sobre el escritorio y el
 * personaje puede empujarlo.
 *
 * A diferencia del resto de modelos, este se construye manualmente
 * porque el material del cuerpo se **redefine** con un color de la
 * paleta (no se usa el del GLB).
 *
 * El .glb tiene 5 mallas (`baseBorrador`, `borradorLapiz`,
 * `cuerpoLapiz`, `minaLapiz`, `puntaLapiz`) y 5 materiales. El
 * material del cuerpo (`cuerpoLapizMaterial1`) se sustituye por uno
 * custom con el color de la paleta.
 */
interface Props {
  groupProps: JSX.IntrinsicElements['group'];
  paleta: NombrePaleta;
  intensidad: IntensidadColor;
}

const Model = (props: Props) => {
  const { nodes, materials } = useGLTF('/3d-models/lapiz.glb');

  return (
    <RigidObject
      type="dynamic"
      sound="wood"
      colliders="cuboid"
      position={props.groupProps.position as [number, number, number]}
      rotation={props.groupProps.rotation as [number, number, number] | undefined}
      scale={
        (props.groupProps.scale as number | [number, number, number] | undefined) ?? 1
      }
    >
      <mesh
        castShadow
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
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.cuerpoLapiz as Mesh).geometry}
      >
        <meshStandardMaterial color={paletaColores[props.paleta][props.intensidad]} />
      </mesh>
      <mesh
        castShadow
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
    </RigidObject>
  );
};

useGLTF.preload('/3d-models/lapiz.glb');

export default Model;