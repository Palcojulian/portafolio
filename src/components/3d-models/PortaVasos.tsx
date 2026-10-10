import { Mesh, MeshStandardMaterial } from 'three'

import { useGLTF } from '@react-three/drei'
import type { JSX } from 'react'
import { paletaColores } from '../../helpers/paleta-colores'


export default function Model(props: JSX.IntrinsicElements['group']) {
    const { nodes } = useGLTF('/3d-models/portaVasos.glb')
    const mausePadMaterial = new MeshStandardMaterial({
        color: paletaColores['azulGrisOscuro'][200]
    })
    return (
        <group {...props} dispose={null}>
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.portaVasos as Mesh).geometry}
                material={mausePadMaterial}
            />
        </group>
    )
}

useGLTF.preload('/3d-models/portaVasos.glb')
