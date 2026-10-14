# Stack tecnológico

> Inicio > 01 — Arquitectura > Stack tecnológico

Este documento lista **todas** las dependencias del proyecto con la versión exacta declarada en `package.json` y el rol que juegan.

## Dependencias de producción (`dependencies`)

| Librería | Versión | Rol |
|---|---|---|
| `react` | `19.2.0` | Librería UI base. Todo el árbol de componentes está hecho con React. |
| `react-dom` | `19.2.0` | Renderiza React en el DOM del navegador. |
| `three` | `^0.186.0` | Motor 3D subyacente. `react-three-fiber` es un wrapper declarativo sobre three.js. |
| `@react-three/fiber` | `^9.7.0` | Componente `<Canvas>` y hooks (`useFrame`, `useThree`) para usar three.js de forma declarativa en React. |
| `@react-three/drei` | `^10.0.7` | Colección de helpers y componentes listos para usar: `OrbitControls`, `Sky`, `useGLTF`, `useHelper`, etc. |
| `@react-three/rapier` | `^2.2.0` | Bindings de **Rapier** (motor de física) para react-three-fiber. **Instalado pero no utilizado actualmente.** |

## Dependencias de desarrollo (`devDependencies`)

| Librería | Versión | Rol |
|---|---|---|
| `vite` | `^8.2.2` | Bundler y dev server. Es el motor de HMR. |
| `@vitejs/plugin-react` | `^6.1.0` | Plugin oficial de Vite para React (usa **Oxc** internamente, no Babel ni SWC). |
| `typescript` | `~6.0.2` | Lenguaje. Aporta los tipos estáticos al proyecto. |
| `@types/node` | `^24.13.3` | Tipos de Node.js (necesarios para la configuración de Vite en `vite.config.ts`). |
| `@types/react` | `^19.2.18` | Tipos de React. |
| `@types/react-dom` | `^19.2.4` | Tipos de `react-dom`. |
| `eslint` | `^10.9.0` | Linter. Encuentra errores y malas prácticas. |
| `@eslint/js` | `^10.0.1` | Reglas base recomendadas de ESLint. |
| `typescript-eslint` | `^8.67.0` | Reglas específicas de TypeScript para ESLint. |
| `eslint-plugin-react-hooks` | `^7.1.1` | Reglas para los hooks de React (regla de exhaustive-deps). |
| `eslint-plugin-react-refresh` | `^0.5.4` | Asegura que los componentes se exportan de forma compatible con Fast Refresh (HMR de Vite). |
| `globals` | `^17.11.0` | Define globales como `browser`, `node`, `es2023`, etc., para ESLint. |

## Lenguajes y formatos

- **TypeScript** con `jsx: "react-jsx"` (transformación automática, no hace falta `import React`).
- **CSS plano** importado en `main.tsx` (`./index.css`). No se usa Tailwind, CSS Modules ni styled-components.
- **Modelos 3D** en formato **`.glb`** (GLTF binario, especificación Khronos).
- **HTML** con un único `<div id="root">` donde se monta la app (`index.html`).

## Diagrama de capas

```mermaid
flowchart TB
    subgraph App[Nivel aplicación]
        React[React 19]
        Componentes[Componentes .tsx]
    end

    subgraph R3F[Nivel react-three-fiber]
        Fiber[@react-three/fiber]
        Drei[@react-three/drei]
        Rapier[@react-three/rapier<br/>⚠️ sin usar]
    end

    subgraph Three[Nivel three.js]
        Three[three.js]
    end

    subgraph Toolchain[Toolchain]
        Vite[Vite 8 + plugin-react]
        TS[TypeScript 6]
        ESLint[ESLint 10]
    end

    Componentes --> Fiber
    Componentes --> Drei
    Componentes --> Rapier
    Fiber --> Three
    Drei --> Three
    Rapier --> Three
    Componentes --> React
    Vite --> Componentes
    TS --> Componentes
    ESLint --> Componentes
```

## Notas de versiones

- **Versiones muy recientes.** El proyecto usa versiones *latest* de casi todas las dependencias (React 19, Vite 8, TypeScript 6, ESLint 10). Esto significa que algunas APIs podrían no estar documentadas extensivamente en Stack Overflow; consulta la documentación oficial.
- **TypeScript `~6.0.2`** (tilde): permite parches `6.0.x` pero no `6.1`. Está fijado por seguridad.
- **`@react-three/rapier` está instalado pero no se usa.** Está disponible por si en el futuro se quieren añadir físicas (colisiones, gravedad, RigidBody, etc.).

## Documentos relacionados

- [Visión general](./vision-general.md)
- [Estructura de carpetas](./estructura-carpetas.md)
- [Instalación](../02-setup/instalacion.md)