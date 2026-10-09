
import type { Mesh } from 'three'
import { useGLTF } from '@react-three/drei'
import type { JSX } from 'react/jsx-dev-runtime'

export default function Model(props: JSX.IntrinsicElements['group']) {

  const { nodes, materials } = useGLTF('/3d-models/desk-table.glb');

  return (
    <group {...props} dispose={null}>
      <mesh 
        castShadow
        receiveShadow
        geometry={(nodes.estructura as Mesh).geometry} 
        material={materials['base-table']}
      />
      <mesh 
        castShadow
        receiveShadow
        geometry={(nodes.table as Mesh).geometry} 
        material={materials['option-2-table']}
      />
    </group>
  )
}

useGLTF.preload('/3d-models/desk-table.glb')
