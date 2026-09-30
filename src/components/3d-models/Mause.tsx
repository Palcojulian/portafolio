import { Mesh } from 'three'
import { useGLTF } from '@react-three/drei'
import type { JSX } from 'react';


export default function Model(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/3d-models/mause.glb');
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.mausePart1 as Mesh).geometry}
        material={(nodes.mausePart1 as Mesh).material}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.mausePart2 as Mesh).geometry}
        material={materials['Material.002']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.mausePart3 as Mesh).geometry}
        material={(nodes.mausePart3 as Mesh).material}
      />
    </group>
  )
}

useGLTF.preload('/3d-models/mause.glb')