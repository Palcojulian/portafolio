import {Mesh} from 'three'
import { useGLTF } from '@react-three/drei'
import type { JSX } from 'react'

export default function Model(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/3d-models/gitHubLogo.glb');
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.baseModel as Mesh).geometry}
        material={materials.baseModelMaterial}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.iconLogo as Mesh).geometry}
        material={materials.iconLogoMaterial}
      />
    </group>
  )
}

useGLTF.preload('/3d-models/gitHubLogo.glb')
