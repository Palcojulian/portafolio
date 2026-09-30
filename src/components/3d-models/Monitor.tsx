import { Mesh } from 'three'
import { useGLTF } from '@react-three/drei'
import type { JSX } from 'react'


export default function Model(props: JSX.IntrinsicElements['group']) {
    const { nodes } = useGLTF('/3d-models/monitor.glb');
    return (
        <group {...props} dispose={null}>
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.bigBaseMonitor as Mesh).geometry}
                material={(nodes.bigBaseMonitor as Mesh).material}
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
                material={(nodes.monitorBackPart as Mesh).material}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.portsMonitor as Mesh).geometry}
                material={(nodes.portsMonitor as Mesh).material}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.screenMonitor as Mesh).geometry}
                material={(nodes.screenMonitor as Mesh).material}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.smallBaseMonitor as Mesh).geometry}
                material={(nodes.smallBaseMonitor as Mesh).material}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.squareBaseMonitor as Mesh).geometry}
                material={(nodes.squareBaseMonitor as Mesh).material}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.supportMonitor as Mesh).geometry}
                material={(nodes.supportMonitor as Mesh).material}
            />
        </group>
    )
}

useGLTF.preload('/3d-models/monitor.glb')