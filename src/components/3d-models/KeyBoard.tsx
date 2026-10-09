
import type { Mesh } from 'three'

import { useGLTF } from '@react-three/drei'
import type { JSX } from 'react';



export default function Model(props: JSX.IntrinsicElements['group']) {
    const { nodes, materials } = useGLTF('/3d-models/keyboard.glb');

    return (
        <group {...props} dispose={null}>
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes['0_KEY'] as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes['1_KEY'] as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes['2_KEY'] as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes['3_KEY'] as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes['4_KEY'] as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes['5_KEY'] as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes['6_KEY'] as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes['7_KEY'] as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes['8_KEY'] as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes['9_KEY'] as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.A_KEY as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.ALT_KEY as Mesh).geometry}
                material={materials.skyKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.ALTGR_KEY as Mesh).geometry}
                material={materials.skyKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.B_KEY as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.BACKSLASH_KEY as Mesh).geometry}
                material={materials.skyKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.BASE_FILA1_PART1 as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.BASE_FILA1_PART2 as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.BASE_FILA2_PART2 as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.BASE_FILA2_PART3 as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.BASE_FILA3_PART1 as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.BASE_FILA3_PART2 as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.BASE_FILA3_PART3 as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.BASE_FILA4_PART1 as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.BASE_FILA4_PART2 as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.BASE_FILA4_PART3 as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.BASE_FILA5_PART1 as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.BASE_FILA5_PART2 as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.BASE_FILA5_PART3 as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.BASE_FILA5_PART4 as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.BASE_FILA5_PART5 as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.BASE_FILA5_PART6 as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.BASE_FILA5_PART7 as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.BASE_FILA5_PART8 as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.BASE_FILA5_PART9 as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.BASE_FILA_2_PART1 as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.BASE_TECLADO as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.C_KEY as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.COMILLAS_KEY as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.CTRL2_KEY as Mesh).geometry}
                material={materials.skyKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.CTRL_KEY as Mesh).geometry}
                material={materials.skyKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.D_KEY as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.DEL_KEY as Mesh).geometry}
                material={materials.skyKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.DOS_PUNTOS_KEY as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.E_KEY as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.ENTER_KEY as Mesh).geometry}
                material={materials.skyKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.F_KEY as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.FILA1_PART1 as Mesh).geometry}
                material={materials.switchColor}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.FILA1_PART2 as Mesh).geometry}
                material={materials.switchColor}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.FILA2_PART1 as Mesh).geometry}
                material={materials.switchColor}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.FILA2_PART2 as Mesh).geometry}
                material={materials.switchColor}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.FILA2_PARTE3 as Mesh).geometry}
                material={materials.switchColor}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.FILA3_PART1 as Mesh).geometry}
                material={materials.switchColor}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.FILA3_PART2 as Mesh).geometry}
                material={materials.switchColor}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.FILA3_PART3 as Mesh).geometry}
                material={materials.switchColor}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.FILA4_PART1 as Mesh).geometry}
                material={materials.switchColor}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.FILA4_PART2 as Mesh).geometry}
                material={materials.switchColor}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.FILA4_PART3 as Mesh).geometry}
                material={materials.switchColor}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.FILA5_PART1 as Mesh).geometry}
                material={materials.switchColor}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.FILA5_PART2 as Mesh).geometry}
                material={materials.switchColor}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.FILA5_PART3 as Mesh).geometry}
                material={materials.switchColor}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.FILA5_PART4 as Mesh).geometry}
                material={materials.switchColor}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.FILA5_PART5 as Mesh).geometry}
                material={materials.switchColor}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.FILA5_PART6 as Mesh).geometry}
                material={materials.switchColor}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.FILA5_PART7 as Mesh).geometry}
                material={materials.switchColor}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.FILA5_PART8 as Mesh).geometry}
                material={materials.switchColor}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.FILA5_PART9 as Mesh).geometry}
                material={materials.switchColor}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.G_KEY as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.GUION_KEY as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.GUION_ONDA_KEY as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.H_KEY as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.HOME2_KEY as Mesh).geometry}
                material={materials.skyKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.HOME_KEY as Mesh).geometry}
                material={materials.blueKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.I_KEY as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.IAGUAL_KEY as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.J_KEY as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.K_KEY as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.L_KEY as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.LLAVE_ABIERTA_KEY as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.LLAVE_CERRADA_KEY as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.M_KEY as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.MAY_KEY as Mesh).geometry}
                material={materials.skyKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.MAYOR_QUE_KEY as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.MENOR_QUE_KEY as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.MENU_KEY as Mesh).geometry}
                material={materials.blueKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.N_KEY as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.O_KEY as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.P_KEY as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Q_KEY as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.R_KEY as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.S_KEY as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.SHIFT_1_KEY as Mesh).geometry}
                material={materials.skyKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.SHIFT_2_KEY as Mesh).geometry}
                material={materials.skyKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.SIGNO_PREGUNTA_KEY as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.SPACE_KEY as Mesh).geometry}
                material={materials.skyKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.T_KEY as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.TAB_KEY as Mesh).geometry}
                material={materials.skyKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.U_KEY as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.V_KEY as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.W_KEY as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.X_KEY as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Y_KEY as Mesh).geometry}
                material={materials.whiteKeys}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Z_KEY as Mesh).geometry}
                material={materials.whiteKeys}
            />
        </group>
    )
}

useGLTF.preload('/3d-models/keyboard.glb')