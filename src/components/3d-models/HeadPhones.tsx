import { Mesh } from 'three'
import { useGLTF } from '@react-three/drei'
import type { JSX } from 'react'

export default function Model(props: JSX.IntrinsicElements['group']) {
  const { nodes } = useGLTF('/3d-models/headPhones.glb');
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.arcoHeadPhone as Mesh).geometry}
        material={(nodes.arcoHeadPhone as Mesh).material}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.lPillow as Mesh).geometry}
        material={(nodes.lPillow as Mesh).material}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.rPillow as Mesh).geometry}
        material={(nodes.rPillow as Mesh).material}
      />
    </group>
  )
}

useGLTF.preload('/3d-models/headPhones.glb')
