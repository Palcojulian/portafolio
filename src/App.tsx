import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, useProgress } from '@react-three/drei';

// Entorno de escena (luces, cámara, controles)
import Controls from './components/scene-environment/Controls';
import Light from './components/scene-environment/Light';
import CamaraController from './components/scene-environment/CamaraController';
import Loader from './components/scene-environment/Loader';

// Environment visual (habitación, decoraciones)
import Room from './components/environment/Room';
import Floor from './components/environment/Floor';
import Plant from './components/environment/Plant';
import WallDecor from './components/environment/WallDecor';

// Sistema de físicas
import PhysicsWorld from './components/physics/PhysicsWorld';

// Modelos 3D — fijos
import DeskTable from './components/3d-models/DeskTable';
import Monitor from './components/3d-models/Monitor';
import MausePad from './components/3d-models/MausePad';
import PortaVasos from './components/3d-models/PortaVasos';

// Modelos 3D — dinámicos
import Taza from './components/3d-models/Taza';
import PortaLapiceros from './components/3d-models/PortaLapiceros';
import KeyBoard from './components/3d-models/KeyBoard';
import Mause from './components/3d-models/Mause';
import RoboticHand from './components/3d-models/RoboticHand';
import HeadPhones from './components/3d-models/HeadPhones';
import Band from './components/3d-models/Band';
import Clock from './components/3d-models/Clock';
import Lapiz from './components/3d-models/Lapiz';
import Lamp from './components/3d-models/Lamp';
import LinkedinLogo from './components/3d-models/LinkedinLogo';
import GitHubLogo from './components/3d-models/GitHubLogo';
import Vehicle from './components/3d-models/Vehicle';

/**
 * Contenido completo de la escena.
 *
 * Se monta dentro del `<Canvas>` envuelto por `<Suspense>`. El fallback
 * del Suspense es `null` (no contiene HTML) porque el indicador de
 * carga real se renderiza **fuera** del Canvas (ver componente `App`).
 */
const Scene = () => {
  return (
    <>
      {/* ─── Sistema de físicas ─── */}
      <PhysicsWorld>
        {/* Suelo físico fijo: recoge los RigidBody dinámicos que caigan fuera */}
        <Floor />

        {/* ─── Objetos físicos fijos (escritorio y ancla de superficie) ─── */}
        <DeskTable />
        <Monitor />
        <MausePad />
        <PortaVasos />

        {/* ─── Objetos físicos dinámicos (caen, colisionan, arrastrables) ─── */}
        <Taza />
        <PortaLapiceros />
        <KeyBoard />
        <Mause />
        <RoboticHand />
        <HeadPhones />
        <Band />
        <Clock />
        <Lamp />
        <LinkedinLogo />
        <GitHubLogo />
        <Vehicle />

        {/* Lápices (4 instancias con paleta distinta) */}
        <Lapiz
          key={1}
          groupProps={{ position: [-2, 1.48, -0.4], scale: 0.9 }}
          intensidad={500}
          paleta="amarillos"
        />
        <Lapiz
          key={2}
          groupProps={{ position: [-1.96, 1.48, -0.4], scale: 0.9 }}
          intensidad={500}
          paleta="rojos"
        />
        <Lapiz
          key={3}
          groupProps={{ position: [-2, 1.48, -0.28], scale: 0.9 }}
          intensidad={500}
          paleta="azulGrisOscuro"
        />
        <Lapiz
          groupProps={{ position: [-1.96, 1.48, -0.28], scale: 0.9 }}
          intensidad={500}
          paleta="verdes"
        />
      </PhysicsWorld>

      {/* ─── Environment visual (sin físicas) ─── */}
      <Room />
      <Plant />
      <WallDecor />

      {/* ─── Sistema de escena ─── */}
      <Light />
      <Controls />
      <CamaraController />

      {/* Fuerza la precarga de todos los useGLTF.preload() declarados */}
      <Preload all />
    </>
  );
};

/**
 * Componente "puente" que consulta el porcentaje de carga y decide
 * si el `<Loader />` debe mostrarse. Vive en el árbol de React pero
 * puede usar hooks de `@react-three/drei` como `useProgress` aunque
 * no esté dentro del `<Canvas>`, porque drei expone un store global
 * al que se suscribe.
 */
const ProgressBridge = ({ children }: { children: React.ReactNode }) => {
  const { progress, total } = useProgress();
  const isLoading = progress < 100 || total === 0;
  return (
    <>
      <Loader active={isLoading} />
      {children}
    </>
  );
};

const App = () => {
  return (
    <ProgressBridge>
      <div id="canvas-container">
        <Canvas
          shadows
          style={{ height: '100vh', width: '100%' }}
        >
          {/* Suspense: mientras la escena no esté lista, no renderiza
              contenido three.js. El indicador visual está fuera del Canvas. */}
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>
    </ProgressBridge>
  );
};

export default App;