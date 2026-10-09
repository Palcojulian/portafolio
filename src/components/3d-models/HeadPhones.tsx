import { Mesh } from 'three'
import { useGLTF } from '@react-three/drei'
import type { JSX } from 'react'

export default function Model(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/3d-models/headPhones.glb');
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.meshArcoHeadPhone as Mesh).geometry}
        material={materials.baseMaterial}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.meshArcoHeadPhone_1 as Mesh).geometry}
        material={materials.Material}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.meshLPillow as Mesh).geometry}
        material={materials.baseMaterial}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.meshLPillow_1 as Mesh).geometry}
        material={materials.Material}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.meshRPillow as Mesh).geometry}
        material={materials.baseMaterial}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.meshRPillow_1 as Mesh).geometry}
        material={materials.Material}
      />
    </group>
  )
}

useGLTF.preload('/3d-models/headPhones.glb')
