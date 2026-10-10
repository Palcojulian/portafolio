import { Mesh, MeshStandardMaterial } from 'three'
import { useGLTF } from '@react-three/drei'
import type { JSX } from 'react'
import { paletaColores } from '../../helpers/paleta-colores'

export default function Model(props: JSX.IntrinsicElements['group']) {
    const { nodes } = useGLTF('/3d-models/mausePad.glb')
    const mausePadMaterial = new MeshStandardMaterial({
        color: paletaColores['verdePetroleo'][500]
    })
    
    return (
        <group {...props} dispose={null}>
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.mausePad as Mesh).geometry}
                material={mausePadMaterial}
            />
        </group>
    )
}

useGLTF.preload('/3d-models/mausePad.glb')
