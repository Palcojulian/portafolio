import { useHelper } from '@react-three/drei';
import { DirectionalLightHelper } from "three"

import { useRef } from 'react';

const Light = () => {
  const refLight = useRef<DirectionalLightHelper>(null!);
  
  useHelper(refLight, DirectionalLightHelper,1,"red");
  
  return (
    <>
        <color attach="background" args={["#000"]} />
        <directionalLight
          ref={refLight}
          intensity={2.5}
          color="white"
          position={[0,4,3]}
        > 
            <object3D attach="target" position={[0,1.5,0]} />
        </directionalLight>
    </>
  )
}

export default Light;
