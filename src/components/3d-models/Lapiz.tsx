import { Mesh, MeshStandardMaterial } from 'three'
import { useGLTF } from '@react-three/drei'
import type { JSX } from 'react';
import { paletaColores, type NombrePaleta, type IntensidadColor } from './../../helpers/paleta-colores';

interface Props {
  groupProps: JSX.IntrinsicElements['group'],
  paleta: NombrePaleta,
  intensidad: IntensidadColor,
}


export default function Model(props: Props) {
  const { nodes, materials } = useGLTF('/3d-models/lapiz.glb');

  const customMaterial = new MeshStandardMaterial({color: paletaColores[props.paleta][props.intensidad]});

  return (
    <group {...props.groupProps} dispose={null}>
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
        material={customMaterial}
      />
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
    </group>
  )
}

useGLTF.preload('/3d-models/lapiz.glb')
