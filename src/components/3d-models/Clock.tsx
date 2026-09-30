import type { Mesh } from 'three'
import type { JSX } from 'react';
import { useGLTF } from '@react-three/drei'

export default function Model(props: JSX.IntrinsicElements['group']) {
  const { nodes } = useGLTF('/3d-models/clock.glb');
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.boxClock as Mesh).geometry}
        material={(nodes.boxClock as Mesh).material}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.screenClock as Mesh).geometry}
        material={(nodes.screenClock as Mesh).material}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.supportsClock as Mesh).geometry}
        material={(nodes.supportsClock as Mesh).material}
      />
    </group>
  )
}

useGLTF.preload('/3d-models/clock.glb')
