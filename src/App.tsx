import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber'

function App() {

  return (
    <div id="canvas-container">
      <Canvas 
        camera={{ position: [2, 0, 5] }} 
        style={{ height: "100vh", width: "100%" }} 
        shadows={true}
      >
        <OrbitControls
          enableZoom={false}
          enableRotate={true}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />
        <mesh>
          <boxGeometry args={[2, 2, 2]}  />
          <meshPhongMaterial color="purple" />
        </mesh>
        <ambientLight intensity={3} />
        <directionalLight
          position={[0, 5, 5]}
          intensity={6}
          castShadow={true}
          color="red"
        />
        {/* <Environment preset="forest" background={false} /> */}
      </Canvas>
    </div>
  )
}

export default App;
