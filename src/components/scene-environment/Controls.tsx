import { OrbitControls, useHelper } from '@react-three/drei';
import { DirectionalLightHelper } from "three"

import { useRef } from 'react';

const Controls = () => {
    const refLight = useRef(null);
    useHelper(refLight.current, DirectionalLightHelper, 1, "red");

    return (
        <>
            <OrbitControls
                target={[0, 2.5, 0]}
                enableZoom={!true}
                enableRotate={!true}
            />
        </>

    )
}

export default Controls;
