
import { Canvas } from '@react-three/fiber'

//Environment
import Controls from './components/scene-environment/Controls'
import Light from './components/scene-environment/Light'
import CamaraController from './components/scene-environment/CamaraController'
import { Sky } from '@react-three/drei'

//3D Models
import DeskTable from './components/3d-models/DeskTable'
import Taza from './components/3d-models/Taza'
import Monitor from './components/3d-models/Monitor'
import PortaLapiceros from './components/3d-models/PortaLapiceros'
import KeyBoard from './components/3d-models/KeyBoard'
import Mause from './components/3d-models/Mause'
import RoboticHand from './components/3d-models/RoboticHand'
import HeadPhones from './components/3d-models/HeadPhones'
import Band from './components/3d-models/Band'
import Clock from './components/3d-models/Clock'
import Lapiz from './components/3d-models/Lapiz'
import Lamp from './components/3d-models/Lamp'
import LinkedinLogo from './components/3d-models/LinkedinLogo'
import GitHubLogo from './components/3d-models/GitHubLogo'
import Vehicle from './components/3d-models/Vehicle'
import MausePad from './components/3d-models/MausePad'
import PortaVasos from './components/3d-models/PortaVasos'

const App = () => {

  return (
    <div id="canvas-container">
      <Canvas
        style={{ height: "100vh", width: "100%" }}
      >
        {/* Enviroment */}
        <Light />
        <Controls />
        <CamaraController />
        <Sky />

        {/* 3D Models */}

        <DeskTable
          position={[0, -0.5, 0]}
        />

        <Taza
          position={[-2.2, 1.48, 0.56]}
          scale={0.6}
        />

        <Monitor
          position={[0, 1.43, -0.48]}
          scale={1}
          rotation={[0, 4.7, 0]}
        />

        <KeyBoard
          position={[0, 1.55, 0.38]}
          scale={1.7}
          rotation={[0, 0.05, 0]}
        />

        <Mause
          position={[0.9, 1.48, 0.38]}
          scale={2.4}
          rotation={[0, 0.3, 0]}
        />

        <RoboticHand
          position={[-1.4, 1.48, -0.5]}
          scale={1.2}
          rotation={[0, -4.6, 0]}
        />

        <HeadPhones
          position={[1.5, 1.57, 0.4]}
          scale={1.6}
          rotation={[0, 0.7, -1.68]}
        />

        <Clock
          position={[0.7, 1.476, -0.3]}
          scale={4}
          rotation={[0, 0, 0]}
        />

        <Band
          position={[-1.4, 1.535, 0.4]}
          scale={0.45}
          rotation={[0, 1, 1.46]}
        />

        <PortaLapiceros
          position={[-2, 1.48, -0.4]}
          scale={1}
        />
        <Lapiz
          key={1}
          groupProps={{
            position: [-2, 1.48, -0.4],
            scale: 0.9
          }}
          intensidad={500}
          paleta='amarillos'
        />
        <Lapiz
          key={2}
          groupProps={{
            position: [-1.96, 1.48, -0.4],
            scale: 0.9
          }}
          intensidad={500}
          paleta='rojos'
        />
        <Lapiz
          key={3}
          groupProps={{
            position: [-2, 1.48, -0.28],
            scale: 0.9
          }}
          intensidad={500}
          paleta='azulGrisOscuro'
        />
        <Lapiz
          groupProps={{
            position: [-1.96, 1.48, -0.28],
            scale: 0.9
          }}
          intensidad={500}
          paleta='verdes'
        />

        <Lamp
          position={[2, 1.47, -0.3]}
          scale={1.5}
          rotation={[0, 5.5, 0]}
        />

        <LinkedinLogo
          position={[1.4, 1.49, -0.3]}
          scale={0.4}
        />

        <GitHubLogo
          position={[1.65, 1.49, -0.3]}
          scale={0.45}
        />

        <Vehicle
          position={[-2, 1.49, 0.2]}
          scale={0.15}
          rotation={[0, 1, 0]}
        />
        <MausePad
          position={[0.15, 1.485, 0.35]}
          scale={0.3}
          rotation={[0, 0, 0]}
        />
        <PortaVasos
          position={[-2.2, 1.485, 0.57]}
          scale={0.7}
          rotation={[0, 0, 0]}
        />

      </Canvas>
    </div>
  )
}

export default App;
