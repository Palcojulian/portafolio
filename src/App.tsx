
import { Canvas } from '@react-three/fiber'
import DeskTable from './components/3d-models/DeskTable'
import Controls from './components/scene-environment/Controls'
import Light from './components/scene-environment/Light'
import CamaraController from './components/scene-environment/CamaraController'
import { Sky } from '@react-three/drei'


const App = () => {

  return (
    <div id="canvas-container">
      <Canvas 
        style={{ height: "100vh", width: "100%" }} 
      >
        <Light />
        <DeskTable position={[0,-0.5,0]} />
        <Controls />
        <CamaraController />
        <Sky />
      </Canvas>
    </div>
  )
}

export default App;
