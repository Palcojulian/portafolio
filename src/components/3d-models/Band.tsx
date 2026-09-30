import type { Mesh } from 'three'
import type { JSX } from 'react';

import { useGLTF } from '@react-three/drei'

export default function Model(props: JSX.IntrinsicElements['group']) {
    const { nodes } = useGLTF('/3d-models/band.glb');
    return (
        <group {...props} dispose={null}>
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.boxBand_ as Mesh).geometry}
                material={(nodes.boxBand_ as Mesh).material}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.btnBand as Mesh).geometry}
                material={(nodes.btnBand as Mesh).material}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.correaBand as Mesh).geometry}
                material={(nodes.correaBand as Mesh).material}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.hebillaBand as Mesh).geometry}
                material={(nodes.hebillaBand as Mesh).material}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.screenBand as Mesh).geometry}
                material={(nodes.screenBand as Mesh).material}
            />
        </group>
    )
}

useGLTF.preload('/3d-models/band.glb')