import { Mesh } from 'three'
import type { JSX } from 'react'
import { useGLTF } from '@react-three/drei'



export default function Model(props: JSX.IntrinsicElements['group']) {
    const { nodes, materials } = useGLTF('/3d-models/taza.glb');

    return (
        <group {...props} dispose={null}>
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes['taza-mesh'] as Mesh).geometry}
                material={materials.baseMaterial}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes['taza-mesh_1'] as Mesh).geometry}
                material={materials.secondaryMaterial}
            />
        </group>
    )
}

useGLTF.preload('/3d-models/taza.glb')