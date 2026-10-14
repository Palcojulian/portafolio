# Portafolio 3D Interactivo

Portafolio web personal renderizado en **3D** con React + TypeScript + three.js. Un escritorio virtual donde cada objeto es interactivo: el visitante puede **hacer click / hover** sobre los elementos para descubrir información personal, y se incorporarán **colisiones físicas** para que los objetos respondan a la interacción.

## ✨ Características

- 🖥️ **Escena 3D** completa renderizada en el navegador con `react-three-fiber`.
- 🎯 **Interacciones por objeto**: cada elemento del escritorio está pensado para mostrar información al visitante.
- 💥 **Físicas** integradas con `@react-three/rapier` (motor Rapier).
- 🎨 **Paleta de colores propia** definida en código, con tipos estrictos.
- 📦 **17 modelos 3D** en formato `.glb` listos para cargar.

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

Por defecto se sirve en `http://localhost:5173`.

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
├── public/3d-models/        # 17 modelos .glb
├── src/
│   ├── components/
│   │   ├── 3d-models/       # Componentes que renderizan los modelos
│   │   └── scene-environment/  # Luz, controles, cámara
│   ├── helpers/             # paleta-colores.ts
│   ├── hooks/               # (reservado para hooks futuros)
│   ├── App.tsx              # Raíz: monta <Canvas> con todos los modelos
│   └── main.tsx             # Punto de entrada
└── docs/                    # Documentación completa
```