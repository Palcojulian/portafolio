import { Mesh, MeshStandardMaterial } from 'three'
import { useGLTF } from '@react-three/drei'
import type { JSX } from 'react';
import { paletaColores } from './../../helpers/paleta-colores';

export default function Model(props: JSX.IntrinsicElements['group']) {
    const { nodes } = useGLTF('/3d-models/lamp.glb');

    const baseMaterial = new MeshStandardMaterial({
        color: paletaColores['verdeAgua'][300]
    })

    const soporteMaterial = new MeshStandardMaterial({
        color: paletaColores['azulGrisOscuro'][100]
    })

    const exteriorMaterial = new MeshStandardMaterial({
        color: paletaColores['verdeAgua'][300]
    })


    const interiorMaterial = new MeshStandardMaterial({
        color: paletaColores['amarillos'][100]
    })

    const bombilloMaterial = new MeshStandardMaterial({
        color: paletaColores['amarillos'][500]
    })

    const baseBombilloMaterial = new MeshStandardMaterial({
        color: paletaColores['azulGrisOscuro'][500]
    })


    return (
        <group {...props} dispose={null}>
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.baseLamp as Mesh).geometry}
                material={baseMaterial}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.bombilloPart1 as Mesh).geometry}
                material={baseBombilloMaterial}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.bombilloPart2 as Mesh).geometry}
                material={baseBombilloMaterial}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.BombilloPart3 as Mesh).geometry}
                material={bombilloMaterial}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.exteriorLamp as Mesh).geometry}
                material={exteriorMaterial}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.interiorLamp as Mesh).geometry}
                material={interiorMaterial}

            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.soporteLamp as Mesh).geometry}
                material={soporteMaterial}
            />
        </group>
    )
}

useGLTF.preload('/3d-models/lamp.glb')