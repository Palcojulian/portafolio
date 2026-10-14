import { Mesh } from 'three'
import { useGLTF } from '@react-three/drei'
import type { JSX } from 'react'

export default function Model(props: JSX.IntrinsicElements['group']) {
    const { nodes, materials } = useGLTF('/3d-models/vehicle.glb');
    return (
        <group {...props} dispose={null}>
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.carMesh as Mesh).geometry}
                material={materials.carMaterial}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.carMesh_1 as Mesh).geometry}
                material={materials.whiteLightMaterial}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.carMesh_2 as Mesh).geometry}
                material={materials.orangeLightMaterial}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.carMesh_3 as Mesh).geometry}
                material={materials.grayMaterial}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.carMesh_4 as Mesh).geometry}
                material={materials.rinesMaterial}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.carMesh_5 as Mesh).geometry}
                material={materials.ventanasMaterial}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.carMesh_6 as Mesh).geometry}
                material={materials.redLightMaterial}
            />
        </group>
    )
}

useGLTF.preload('/3d-models/vehicle.glb')