import { Mesh } from 'three'

import { useGLTF } from '@react-three/drei'
import type { JSX } from 'react'


export default function Model(props: JSX.IntrinsicElements['group']) {
  const { nodes } = useGLTF('/3d-models/porta-lapiceros.glb');
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.portaLapiceros as Mesh).geometry}
        material={(nodes.portaLapiceros as Mesh).material}
      />
    </group>
  )
}

useGLTF.preload('/3d-models/porta-lapiceros.glb')
