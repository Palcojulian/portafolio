# Portafolio 3D Interactivo

Portafolio web personal renderizado en **3D** con React + TypeScript + three.js. Un escritorio virtual donde cada objeto es interactivo: los objetos tienen **físicas** (caen con gravedad y colisionan) y el visitante los mueve **empujándolos con el personaje**. Próximamente: **click / hover** sobre los elementos para descubrir información personal.

## ✨ Características

- 🖥️ **Escena 3D interior** con habitación, planta decorativa y cuadro en la pared.
- 💡 **Iluminación realista** con luz ambiental, luz direccional principal con sombras nítidas, y luz de relleno.
- 🖐️ **Físicas con Rapier**: la taza, los lápices, los auriculares, etc. caen sobre el escritorio con gravedad y chocan entre sí; sólo el personaje puede moverlos.
- 🐾 **Personaje controlable**: un gato animado que se mueve con `WASD`/flechas, corre con `Shift`, salta con `Espacio` y empuja los objetos del escritorio. `R` lo devuelve al escritorio y `H` muestra/oculta la ayuda.
- 🔊 **Sonidos de impacto** sintetizados según el material (cerámica, plástico, metal, madera) cuando un objeto cae al suelo. `M` silencia.
- ☕ **Taza rompible**: si cae al suelo con fuerza se hace añicos y, a los pocos segundos, reaparece entera.
- 📌 **Objetos fijos** (escritorio, monitor, mausePad, portaVasos) permanecen anclados.
- 🎨 **Paleta de colores propia** definida en código, con tipos estrictos.
- 📦 **17 modelos 3D** en formato `.glb`.

## 🧰 Stack

- **React 19** + **TypeScript**
- **three.js** + `@react-three/fiber` + `@react-three/drei`
- **@react-three/rapier** para físicas
- **Vite 8** como bundler y dev server

## 🚀 Inicio rápido

```bash
# Instalar dependencias
npm install

# Arrancar el servidor de desarrollo
npm run dev
```

Por defecto se sirve en `http://localhost:5173`. Al cargar, se muestra una pantalla de carga mientras se descargan los modelos 3D (`.glb`); cuando todos están listos, la escena aparece.

Otros scripts disponibles:

```bash
npm run build    # Compila para producción (type-check + bundle)
npm run preview  # Sirve la build de producción localmente
npm run lint     # Ejecuta ESLint
```

## 📚 Documentación

La documentación completa del proyecto está en [`docs/`](./docs/). Algunos documentos clave:

- 📖 [Visión general del proyecto](./docs/01-arquitectura/vision-general.md)
- 🧰 [Stack tecnológico](./docs/01-arquitectura/stack-tecnologico.md)
- 🗂️ [Estructura de carpetas](./docs/01-arquitectura/estructura-carpetas.md)
- ⚙️ [Instalación](./docs/02-setup/instalacion.md)
- 🧩 [Cómo añadir un modelo 3D](./docs/03-componentes/como-anadir-modelo-3d.md)
- 🎬 [Sistema de escena](./docs/04-escena-3d/sistema-de-escena.md)
- 🎨 [Sistema de colores](./docs/05-estilos/sistema-de-colores.md)

Para empezar, el documento más útil es la [**Visión general**](./docs/01-arquitectura/vision-general.md), que explica de un vistazo qué hace el proyecto y cómo está organizado.

## 📁 Estructura rápida

```
portafolio/
├── public/3d-models/             # 17 modelos .glb
├── src/
│   ├── components/
│   │   ├── 3d-models/            # 17 modelos (físicos)
│   │   ├── environment/          # Room, Plant, WallDecor
│   │   ├── physics/              # AutoGLTF, RigidObject
│   │   ├── player/               # Personaje controlable (futuro gato)
│   │   └── scene-environment/    # Luz, controles, loader, ayuda
│   ├── audio/                    # Sonido sintetizado (Web Audio)
│   ├── helpers/                  # paleta-colores.ts, fracturar.ts
│   ├── hooks/                    # useFloorImpact
│   ├── App.tsx                   # Raíz: integra Physics + Environment + modelos
│   └── main.tsx                  # Punto de entrada
└── docs/                         # Documentación completa
```