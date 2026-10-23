import { Suspense, lazy, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { KeyboardControls, Preload, useProgress } from '@react-three/drei';

// Entorno de escena (luces, cámara, controles)
import Controls from './components/scene-environment/Controls';
import { CAMERA_POSITION } from './helpers/camera';
import Light from './components/scene-environment/Light';
import Loader from './components/scene-environment/Loader';
import ControlsHelp from './components/scene-environment/ControlsHelp';
import InteractionManager from './components/interaction/InteractionManager';
import InteractionPrompt from './components/interaction/InteractionPrompt';
import { keyboardMap } from './helpers/keyboardMap';

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

// Personaje controlable con el teclado: el vehículo. (El gato,
// `components/player/Player.tsx`, sigue en el repo sin montar.)
const DrivableVehicle = lazy(() => import('./components/player/DrivableVehicle'));

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
      {/* Incluye los 8 lápices que contiene */}
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

      {/* Personaje controlable con el teclado */}
      <DrivableVehicle />

      {/* Objeto del escritorio más cercano al vehículo + Enter */}
      <InteractionManager />
    </>
  );
};

/**
 * Fotogramas que la simulación espera en pausa tras montar la escena.
 *
 * `@react-three/rapier` crea los colliders automáticos
 * (`colliders="cuboid"`, p. ej. el del escritorio) uno o varios renders
 * después de montar el cuerpo, mientras que los manuales (portalápices,
 * personaje) existen desde el principio. Además, si el primer fotograma
 * es lento, Rapier recupera hasta 0,5 s de simulación de golpe. Sin esta
 * pausa, los objetos caen antes de que exista el escritorio y los
 * delgados (el portalápices) lo atraviesan.
 */
const WARMUP_FRAMES = 5;

/** Cuenta fotogramas desde que se monta y avisa al llegar a `WARMUP_FRAMES`. */
const PhysicsWarmup = ({ onReady }: { onReady: () => void }) => {
  const frames = useRef(0);
  useFrame(() => {
    frames.current += 1;
    if (frames.current === WARMUP_FRAMES) onReady();
  });
  return null;
};

/** `<Physics>` que arranca en pausa hasta que todos los colliders existen. */
const PhysicsStage = () => {
  const [paused, setPaused] = useState(true);
  return (
    <Physics gravity={[0, -9.81, 0]} paused={paused}>
      <PhysicsScene />
      <PhysicsWarmup onReady={() => setPaused(false)} />
    </Physics>
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
      <ControlsHelp hidden={isLoading} />
      <InteractionPrompt hidden={isLoading} />
      {import.meta.env.DEV && <StatsOverlay />}
      {children}
    </>
  );
};

const App = () => {
  return (
    <ProgressBridge>
      <div id="canvas-container">
        <KeyboardControls map={keyboardMap}>
          <Canvas shadows camera={{ position: CAMERA_POSITION }}>
            {/* Fase 1: escena estática (sin esperar a Rapier) */}
            <SceneBase />

            {/* Fase 2: sistema de físicas + objetos. Lazy load del WASM. */}
            <Suspense fallback={null}>
              <PhysicsStage />
            </Suspense>
          </Canvas>
        </KeyboardControls>
      </div>
    </ProgressBridge>
  );
};

export default App;