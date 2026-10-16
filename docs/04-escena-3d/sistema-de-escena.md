# Sistema de escena

> Inicio > 04 — Escena 3D > Sistema de escena

Cómo está organizada la escena 3D: el `<Canvas>`, el environment visual, las físicas, y los modelos.

## El componente raíz: `App.tsx`

```tsx
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
```

`SceneBase` contiene el environment visual y el sistema de escena. `PhysicsScene` contiene todos los componentes físicos (fijos + dinámicos). Ambos se cargan bajo demanda con `React.lazy`.

### Puntos clave

- **`shadows` activado**: necesario para que las sombras del `directionalLight` se rendericen.
- **`<Physics>`** de `@react-three/rapier` envuelve SOLO los objetos físicos (fijos + dinámicos). El environment visual está fuera.
- **El orden de los elementos dentro de `<Physics>` no afecta a la simulación**, pero el orden dentro del `<Canvas>` puede afectar al render (z-buffer).

## Las cuatro capas de la escena

```mermaid
graph TB
    Canvas[Canvas con shadows]

    Canvas --> Physics[⚛️ Physics]
    Canvas --> Env[🏠 Environment visual]
    Canvas --> Models[📦 Modelos 3D]
    Canvas --> Scene[🎬 Sistema de escena]

    Physics --> Floor[Suelo físico]
    Physics --> Fixed[📌 Fijos]
    Physics --> Dynamic[💥 Dinámicos]

    Env --> Room
    Env --> Plant
    Env --> WallDecor

    Scene --> Light
    Scene --> Controls

    Fixed --> DeskTable
    Fixed --> Monitor
    Fixed --> MausePad
    Fixed --> PortaVasos

    Dynamic --> Taza
    Dynamic --> PortaLapiceros
    Dynamic --> KeyBoard
    Dynamic --> Mause
    Dynamic --> RoboticHand
    Dynamic --> HeadPhones
    Dynamic --> Band
    Dynamic --> Clock
    Dynamic --> Lamp
    Dynamic --> LinkedinLogo
    Dynamic --> GitHubLogo
    Dynamic --> Vehicle
    Dynamic --> Lapiz1[Lapiz x4]
```

### Capa de físicas (`physics/`)

Define el sistema de simulación con Rapier. **El motor de Rapier (incluido su WASM) se carga bajo demanda** mediante `React.lazy` (ver [Rendimiento](../06-rendimiento.md)). Mientras llega:

- **Fase 1 (inmediata)**: el visitante ve el escritorio y las decoraciones.
- **Fase 2 (cuando Rapier carga)**: los RigidBody aparecen y caen con gravedad.

Envuelve a:
- **El suelo físico** (`Floor.tsx`): recoge los RigidBody dinámicos que caigan fuera del escritorio.
- **Los modelos 3D dinámicos** (13): taza, reloj, lámpara, lápices, etc.

### Capa de environment (`environment/`)

Elementos visuales que dan contexto a la escena: paredes, alfombra circular centrada bajo el escritorio, planta, cuadro. **NO incluye el suelo** (que es físico y va dentro de `<Physics>`).

### Capa de modelos (`3d-models/`)

Los 17 componentes que renderizan modelos `.glb`. **Todos están dentro de `RigidObject`**, ya sean fijos o dinámicos.

### Capa de escena (`scene-environment/`)

Las luces, los controles orbitales y la posición de cámara.

## El `<Canvas>` en detalle

```tsx
<Canvas shadows style={{ height: '100vh', width: '100%' }}>
```

| Propiedad | Valor actual | Notas |
|---|---|---|
| `camera.position` | `[0, 3, 4]` | Posición inicial de la cámara. |
| `shadows` | `true` | Activa el render de sombras. |

## Cámara y controles

```mermaid
graph LR
    Cam[Canvas camera<br/>position 0, 3, 4]
    Ctrl[Controls<br/>target 0, 1.5, 0]
    Visit[🖱️ Usuario arrastra]

    Cam -.posiciona.-> CamC[PerspectiveCamera]
    Ctrl -.define pivot.-> CamC
    Visit -.arrastra.-> CamC
```

- **Cámara**: `(0, 3, 4)`, definida con la prop `camera` del `<Canvas>`. OrbitControls la orienta hacia su target. El tamaño del canvas lo da el CSS (`html, body, #root, #canvas-container { height: 100% }`).
- **Target** de `OrbitControls`: `(0, 1.5, 0)` (centro del escritorio).
- **Panning deshabilitado** (`enablePan={false}`) para que el visitante no se "pierda".
- **Distancia limitada** entre `2` y `3` unidades para evitar alejarse demasiado.
- **Rotación polar limitada**: no se puede mirar desde abajo del escritorio (`maxPolarAngle`).

## Render loop

`@react-three/fiber` se encarga del render loop. `@react-three/rapier` se sincroniza automáticamente con él.

```mermaid
sequenceDiagram
    participant Loop as requestAnimationFrame
    participant R3F as react-three-fiber
    participant Rapier as rapier
    participant Three as three.js

    Loop->>R3F: tick
    R3F->>Rapier: world.step()
    Rapier-->>R3F: nuevas posiciones
    R3F->>Three: scene.update()
    R3F->>Three: renderer.render(scene, camera)
```

## Diagrama completo de la escena

```mermaid
graph TB
    HTML[index.html] --> Main[src/main.tsx]
    Main --> App

    subgraph App[App.tsx]
        Container[div#canvas-container]
        Canvas
    end

    Container --> Canvas

    Canvas --> Physics[⚛️ Physics]
    Canvas --> Env[🏠 Environment]
    Canvas --> Scene[🎬 Scene environment]

    Physics --> Models[📦 17 modelos]
    Env --> Room
    Env --> Plant
    Env --> WallDecor
    Scene --> Light
    Scene --> Controls

    Light -.ilumina.-> Models
    Controls -.permite rotar.-> Models
    Rapier -.simula gravedad.-> Models
```

## Limitaciones conocidas

- ❌ **Sin animaciones** en la escena. Los objetos son estáticos hasta que el visitante los mueve.
- ❌ **No hay post-processing**: no hay bloom, tone-mapping, ni effect composer.
- ❌ **No hay interactividad con datos**: todavía no se ha implementado qué pasa cuando el visitante hace click en un objeto (mostrar info personal, etc.).

## Documentos relacionados

- [Sistema de luces](./sistema-de-luces.md)
- [Sistema de físicas](./sistema-de-fisicas.md)
- [Posicionamiento de objetos](./posicionamiento-de-objetos.md)
- [Visión general](../01-arquitectura/vision-general.md)