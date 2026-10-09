import { Mesh } from 'three'
import { useGLTF } from '@react-three/drei'
import type { JSX } from 'react'


export default function Model(props: JSX.IntrinsicElements['group']) {
    const { nodes, materials } = useGLTF('/3d-models/logoLinkedin.glb');
    return (
        <group {...props} dispose={null}>
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.baseLogo as Mesh).geometry}
                material={materials.primaryMaterial}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.lettersLogo as Mesh).geometry}
                material={materials.lettersMaterial}
            />
        </group>
    )
}

useGLTF.preload('/3d-models/logoLinkedin.glb')