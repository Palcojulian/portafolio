import type { Mesh } from 'three'
import type { JSX } from 'react';

import { useGLTF } from '@react-three/drei'

export default function Model(props: JSX.IntrinsicElements['group']) {
    const { nodes, materials } = useGLTF('/3d-models/band.glb');
    return (
        <group {...props} dispose={null}>
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.boxBand_ as Mesh).geometry}
                material={materials.cajon}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.btnBand as Mesh).geometry}
                material={materials.correa}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.correaBand as Mesh).geometry}
                material={materials.correa}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.hebillaBand as Mesh).geometry}
                material={materials.correa}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.screenBand as Mesh).geometry}
                material={materials.correa}
            />
        </group>
    )
}

useGLTF.preload('/3d-models/band.glb')