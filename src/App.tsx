import { Suspense, lazy } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, useProgress } from '@react-three/drei';

// Entorno de escena (luces, cámara, controles)
import Controls from './components/scene-environment/Controls';
import Light from './components/scene-environment/Light';
import CamaraController from './components/scene-environment/CamaraController';
import Loader from './components/scene-environment/Loader';

// Environment visual (habitación, decoraciones — sin físicas)
import Room from './components/environment/Room';
import Plant from './components/environment/Plant';
import WallDecor from './components/environment/WallDecor';

// Sistema de físicas — lazy
const Physics = lazy(async () => {
  const mod = await import('@react-three/rapier');
  return { default: mod.Physics };
});

// Componentes físicos (todos lazy para no arrastrar el chunk al inicio).
const Floor = lazy(() => import('./components/environment/Floor'));
const DeskTable = lazy(() => import('./components/3d-models/DeskTable'));
const Monitor = lazy(() => import('./components/3d-models/Monitor'));
const MausePad = lazy(() => import('./components/3d-models/MausePad'));
const PortaVasos = lazy(() => import('./components/3d-models/PortaVasos'));

const Taza = lazy(() => import('./components/3d-models/Taza'));
const PortaLapiceros = lazy(() => import('./components/3d-models/PortaLapiceros'));
const KeyBoard = lazy(() => import('./components/3d-models/KeyBoard'));
const Mause = lazy(() => import('./components/3d-models/Mause'));
const RoboticHand = lazy(() => import('./components/3d-models/RoboticHand'));
const HeadPhones = lazy(() => import('./components/3d-models/HeadPhones'));
const Band = lazy(() => import('./components/3d-models/Band'));
const Clock = lazy(() => import('./components/3d-models/Clock'));
const Lamp = lazy(() => import('./components/3d-models/Lamp'));
const LinkedinLogo = lazy(() => import('./components/3d-models/LinkedinLogo'));
const GitHubLogo = lazy(() => import('./components/3d-models/GitHubLogo'));
const Vehicle = lazy(() => import('./components/3d-models/Vehicle'));
const Lapiz = lazy(() => import('./components/3d-models/Lapiz'));

// Overlay de diagnóstico
import StatsOverlay from './components/scene-environment/StatsOverlay';

/**
 * Fase 1: escena estática (sin físicas).
 *
 * Se renderiza INMEDIATAMENTE sin esperar al WASM de Rapier. El
 * visitante ve la habitación y las decoraciones casi al instante.
 *
 * **Importante**: no incluye modelos con `<RigidBody>`, porque
 * `react-three-rapier` exige que cualquier RigidBody esté dentro de
 * un `<Physics>`. La fase 2 se encarga de los físicos.
 */
const SceneBase = () => {
  return (
    <>
      {/* Environment visual */}
      <Room />
      <Plant />
      <WallDecor />

      {/* Sistema de escena */}
      <Light />
      <Controls />
      <CamaraController />

      {/* Preload de los modelos fijos (los críticos para el primer
          frame una vez que se monta Physics). */}
      <Preload />
    </>
  );
};

/**
 * Fase 2: objetos físicos.
 *
 * Se monta dentro de `<Physics>`, que carga el WASM de Rapier
 * bajo demanda. Mientras el WASM no llega, no se muestran; cuando
 * está listo, aparecen y caen con gravedad.
 */
const PhysicsScene = () => {
  return (
    <>
      {/* Suelo físico fijo */}
      <Floor />

      {/* Objetos físicos fijos */}
      <DeskTable />
      <Monitor />
      <MausePad />
      <PortaVasos />

      {/* Objetos físicos dinámicos */}
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
    </>
  );
};

/**
 * Componente "puente" que consulta el porcentaje de carga y decide
 * si el `<Loader />` debe mostrarse.
 */
const ProgressBridge = ({ children }: { children: React.ReactNode }) => {
  const { progress, total } = useProgress();
  const isLoading = progress < 100 || total === 0;
  return (
    <>
      <Loader active={isLoading} />
      <StatsOverlay />
      {children}
    </>
  );
};

const App = () => {
  return (
    <ProgressBridge>
      <div id="canvas-container">
        <Canvas shadows style={{ height: '100vh', width: '100%' }}>
          {/* Fase 1: escena estática (sin esperar a Rapier) */}
          <SceneBase />

          {/* Fase 2: sistema de físicas + objetos. Lazy load del WASM. */}
          <Suspense fallback={null}>
            <Physics gravity={[0, -9.81, 0]}>
              <PhysicsScene />
            </Physics>
          </Suspense>
        </Canvas>
      </div>
    </ProgressBridge>
  );
};

export default App;