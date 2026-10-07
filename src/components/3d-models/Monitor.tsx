import { Mesh } from 'three'
import { useGLTF } from '@react-three/drei'
import type { JSX } from 'react'


export default function Model(props: JSX.IntrinsicElements['group']) {
    const { nodes, materials } = useGLTF('/3d-models/monitor.glb');
    return (
        <group {...props} dispose={null}>
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.bigBaseMonitor as Mesh).geometry}
                material={materials.backMaterial}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.lineBaseMonitor as Mesh).geometry}
                material={(nodes.lineBaseMonitor as Mesh).material}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.monitorBackPart as Mesh).geometry}
                material={materials.backMaterial}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.portsMonitor as Mesh).geometry}
                material={materials.inPartsMaterial}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.screenMonitor as Mesh).geometry}
                material={materials.screenMaterial}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.smallBaseMonitor as Mesh).geometry}
                material={materials.inPartsMaterial}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.squareBaseMonitor as Mesh).geometry}
                material={materials.inPartsMaterial}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.supportMonitor as Mesh).geometry}
                material={materials.columBaseMaterial}
            />
        </group>
    )
}

useGLTF.preload('/3d-models/monitor.glb')