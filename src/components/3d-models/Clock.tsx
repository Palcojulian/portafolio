import type { Mesh } from 'three'
import type { JSX } from 'react';
import { useGLTF } from '@react-three/drei'

export default function Model(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/3d-models/clock.glb');
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.boxClock as Mesh).geometry}
        material={materials.boxMaterial}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.screenClock as Mesh).geometry}
        material={materials.screenMaterial}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.supportsClock as Mesh).geometry}
        material={materials.baseMaterial}
      />
    </group>
  )
}

useGLTF.preload('/3d-models/clock.glb')
