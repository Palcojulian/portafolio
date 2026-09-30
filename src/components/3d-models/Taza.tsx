import { Mesh } from 'three'
import type { JSX } from 'react'
import { useGLTF } from '@react-three/drei'



export default function Model(props: JSX.IntrinsicElements['group']) {
    const { nodes } = useGLTF('/3d-models/taza.glb');

    return (
        <group {...props} dispose={null}>
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.tazaModel as Mesh).geometry}
                material={(nodes.tazaModel as Mesh).material}
            />
        </group>
    )
}

useGLTF.preload('/3d-models/taza.glb')