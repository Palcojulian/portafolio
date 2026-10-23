# 📚 Documentación del Portafolio 3D

> Índice general de toda la documentación del proyecto.

## 🎯 Propósito

Esta carpeta contiene la documentación técnica completa del proyecto **Portafolio 3D**, una aplicación web interactiva que renderiza un escritorio virtual con objetos 3D usando React, TypeScript y three.js.

Está pensada para:

- **Onboarding rápido** de nuevos colaboradores.
- **Mantenimiento** a futuro del proyecto.
- **Escalabilidad**, añadiendo nuevos modelos o funcionalidades.

---

## 📖 Índice de documentos

### 🏗️ 01 — Arquitectura

Documenta la estructura general del proyecto, las tecnologías usadas y cómo está organizado el código.

| # | Documento | Descripción |
|---|---|---|
| 01 | [Visión general](./01-arquitectura/vision-general.md) | Qué es el proyecto, objetivo y alcance. |
| 02 | [Stack tecnológico](./01-arquitectura/stack-tecnologico.md) | Versiones exactas y rol de cada dependencia. |
| 03 | [Estructura de carpetas](./01-arquitectura/estructura-carpetas.md) | Mapa completo del proyecto, archivo por archivo. |

### ⚙️ 02 — Setup

Cómo preparar el entorno local para desarrollar.

| # | Documento | Descripción |
|---|---|---|
| 04 | [Instalación](./02-setup/instalacion.md) | Clonar el repo, instalar dependencias y arrancar el dev server. |
| 05 | [Scripts npm](./02-setup/scripts-npm.md) | Referencia de los scripts disponibles en `package.json`. |
| 06 | [Configuración de IDEs](./02-setup/configuracion-ides.md) | Extensiones recomendadas para VSCode y compañía. |

### 🧩 03 — Componentes

Guías para crear y mantener componentes 3D.

| # | Documento | Descripción |
|---|---|---|
| 07 | [Cómo añadir un modelo 3D](./03-componentes/como-anadir-modelo-3d.md) | Tutorial paso a paso: del `.glb` al componente. |
| 08 | [Cómo crear un componente reutilizable](./03-componentes/como-crear-componente-reutilizable.md) | Patrón parametrizable observado en `Lapiz.tsx`. |
| 09 | [Guía de diseño de componentes](./03-componentes/guia-de-diseno-completo.md) | Convenciones de nombrado, props, materiales y sombras. |

### 🎬 04 — Escena 3D

Cómo funciona la escena renderizada con react-three-fiber.

| # | Documento | Descripción |
|---|---|---|
| 10 | [Sistema de escena](./04-escena-3d/sistema-de-escena.md) | `Canvas`, capas (environment vs models), jerarquía. |
| 11 | [Sistema de luces](./04-escena-3d/sistema-de-luces.md) | `directionalLight`, ambient, sombras. |
| 12 | [Sistema de físicas](./04-escena-3d/sistema-de-fisicas.md) | Rapier, fijos vs dinámicos, objetos rompibles. |
| 12b | [Sistema de personaje](./04-escena-3d/sistema-de-personaje.md) | El gato animado (en el repo, sin montar en la escena). |
| 12d | [Sistema de vehículo](./04-escena-3d/sistema-de-vehiculo.md) | El coche controlable: conducción, colisiones y modelo con ruedas separadas. |
| 12c | [Sistema de sonido](./04-escena-3d/sistema-de-sonido.md) | Sonidos sintetizados al caer al suelo; taza rompible. |
| 13 | [Loading y Suspense](./04-escena-3d/loading-y-suspense.md) | Cómo se muestran los `.glb` mientras se cargan. |
| 14 | [Posicionamiento de objetos](./04-escena-3d/posicionamiento-de-objetos.md) | Sistema de coordenadas y tabla con posiciones actuales. |

### 🎨 05 — Estilos

Sistema visual del proyecto.

| # | Documento | Descripción |
|---|---|---|
| 15 | [Sistema de colores](./05-estilos/sistema-de-colores.md) | Cómo usar `helpers/paleta-colores.ts`. |

### ⚡ 06 — Rendimiento

Estrategia de optimización y métricas.

| # | Documento | Descripción |
|---|---|---|
| 16 | [Rendimiento](./06-rendimiento.md) | Code-splitting, lazy-load, chunk sizes, cómo iterar. |

---

## 🧭 Cómo navegar

Cada documento empieza con un breadcrumb como este:

```
> Inicio > Sección > Nombre del documento
```

Y termina con un bloque de **"Documentos relacionados"** con enlaces a material afín.

## 📐 Convenciones generales

- **Idioma:** todos los documentos están escritos en español.
- **Diagramas:** se utiliza Mermaid (compatible con GitHub, VSCode y la mayoría de visores Markdown).
- **Fechas:** no se incluyen fechas de creación para mantener los documentos "atemporales". Si un documento queda obsoleto, se marca en la cabecera con `> ⚠️ DOCUMENTO OBSOLETO`.

## 🤝 Contribuir a la documentación

Si encuentras información incorrecta o desactualizada:

1. Edita directamente el archivo `.md` correspondiente.
2. Mantén el breadcrumb superior.
3. Si añades un documento nuevo, inclúyelo también en este índice.