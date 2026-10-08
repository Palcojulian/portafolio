import { Mesh } from 'three'
import { useGLTF } from '@react-three/drei'
import type { JSX } from 'react';



export default function Model(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/3d-models/lapiz.glb');
  return (
    <group {...props} dispose={null}>
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
        material={materials.cuerpoLapizMaterial1}
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
