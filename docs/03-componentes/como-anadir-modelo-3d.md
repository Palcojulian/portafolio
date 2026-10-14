# Cómo añadir un modelo 3D

> Inicio > 03 — Componentes > Cómo añadir un modelo 3D

Tutorial paso a paso para añadir un nuevo objeto 3D al escritorio.

## Visión general del flujo

```mermaid
flowchart LR
    A[🎨 Modelo fuente<br/>.blend, .fbx, .obj] -->|exporta con Blender| B[📦 Archivo .glb]
    B -->|copia a| C[public/3d-models/]
    C -->|referencia en| D[Componente .tsx]
    D -->|monta en| E[App.tsx]
```

## Paso 1 — Obtener el modelo `.glb`

Si ya tienes un `.glb`, salta al paso 2. Si tienes un `.blend`, `.fbx` u otro formato:

1. Ábrelo en **Blender**.
2. Asegúrate de que el modelo está centrado en el origen y a una escala razonable (los objetos del proyecto están en torno a `0.5`–`2.5` unidades).
3. Renombra los nodos/mallas internas a algo descriptivo (`cuerpo`, `base`, etc.). Estos nombres aparecerán en `nodes` y `materials` dentro de `useGLTF`.
4. Ve a `File → Export → glTF Binary (.glb)`.
5. Marca las opciones:
   - ✅ Format: glTF Binary (`.glb`)
   - ✅ Compression (si está disponible)
   - ❌ Textures (las texturas ya van embebidas en `.glb`)
6. Exporta.

## Paso 2 — Colocar el `.glb` en `public/3d-models/`

```bash
# Ejemplo: añadir un "book.glb"
cp /ruta/al/book.glb public/3d-models/book.glb
```

Convención de nombres:

- **minúsculas** (excepto nombres propios: `gitHubLogo.glb`, `logoLinkedin.glb`).
- **separador `-`** (kebab-case), aunque hay inconsistencias heredadas: `porta-lapiceros.glb` vs `portaVasos.glb`. Por ahora respeta el estilo del proyecto.
- **mismo nombre que el componente** que lo va a consumir: `book.glb` ↔ `Book.tsx`.

## Paso 3 — Crear el componente React

Crea `src/components/3d-models/Book.tsx`:

```tsx
import type { Mesh } from 'three'
import { useGLTF } from '@react-three/drei'
import type { JSX } from 'react/jsx-dev-runtime'

export default function Model(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/3d-models/book.glb')

  return (
    <group {...props} dispose={null}>
      {/* Un mesh por cada parte del modelo */}
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.bookCover as Mesh).geometry}
        material={materials['book-cover']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.bookPages as Mesh).geometry}
        material={materials['book-pages']}
      />
    </group>
  )
}

useGLTF.preload('/3d-models/book.glb')
```

### Notas importantes**

- **`useGLTF.preload(...)`** al final del archivo: pre-carga el modelo cuando se importa el módulo, evitando un flash de "loading" en el primer render.
- **`dispose={null}`**: le indica a react-three-fiber que no libere los recursos del GLB al desmontar. Útil porque muchos modelos se reutilizan.
- **`import type { JSX } from 'react/jsx-dev-runtime'`**: es el tipo correcto para las props del componente. Ver [Guía de diseño](./guia-de-diseno-completo.md).
- **`as Mesh`**: los nodos que devuelve `useGLTF` son `Object3D` por defecto; se castean a `Mesh` para acceder a `.geometry`.

## Paso 4 — Inspeccionar los nombres de nodos

Si no sabes cómo se llaman los nodos internos del `.glb`, añade temporalmente al componente:

```tsx
useGLTF.preload('/3d-models/book.glb')

// Inspeccionar:
console.log(useGLTF('/3d-models/book.glb'))
```

Esto te imprimirá en consola los `nodes` y `materials` disponibles. Renómbralos en Blender si los nombres son feos.

## Paso 5 — Montar en `App.tsx`

Edita `src/App.tsx`:

```tsx
// 1. Importar el nuevo componente
import Book from './components/3d-models/Book'

// 2. Dentro del <Canvas>, donde prefieras (la sección "// 3D Models"):
<Book
  position={[1.2, 1.48, 0.3]}
  scale={0.4}
  rotation={[0, 0.5, 0]}
/>
```

El orden de los componentes dentro de `<Canvas>` **no afecta al z-oculto** (eso depende de `position.z`). Pero sí afecta al **orden de instanciación**, lo que en teoría afecta al orden de pintado en objetos transparentes.

## Paso 6 — Verificar

1. `npm run dev`.
2. Abre el navegador en `http://localhost:5173`.
3. Busca tu modelo. Si no aparece:
   - ¿Salen errores en consola? Léelos.
   - ¿Está bien la ruta en `useGLTF`? Debe empezar por `/3d-models/`.
   - ¿Es correcto el `position`? Empieza siempre con valores simples como `[0, 1.5, 0]` para confirmar que aparece, y luego ajusta.
   - ¿El modelo es demasiado pequeño/grande? Ajusta `scale`.

## Diagrama del flujo de datos en runtime

```mermaid
sequenceDiagram
    participant App as App.tsx
    participant Book as Book.tsx
    participant Drei as @react-three/drei
    participant Browser
    participant FS as Sistema de archivos

    Note over Book,FS: En build/dev: useGLTF.preload
    Drei->>FS: GET /3d-models/book.glb
    FS-->>Drei: archivo binario
    Drei->>Drei: parsea GLTF → { nodes, materials }

    Note over App,Book: En runtime
    App->>Book: <Book position={...} scale={...} />
    Book->>Drei: useGLTF('/3d-models/book.glb')
    Drei-->>Book: { nodes, materials } (cached)
    Book->>Browser: <mesh> por cada nodo
```

## Checklist final

- [ ] El archivo `.glb` está en `public/3d-models/`.
- [ ] El componente `Book.tsx` está en `src/components/3d-models/`.
- [ ] Cada nodo del `.glb` está mapeado a un `<mesh>` con su `geometry` y `material`.
- [ ] Hay un `useGLTF.preload(...)` al final del archivo.
- [ ] El componente está importado y montado en `App.tsx`.
- [ ] El modelo se ve correctamente posicionado.
- [ ] `npm run lint` no reporta errores.
- [ ] `npm run build` compila sin errores de tipos.

## Documentos relacionados

- [Cómo crear un componente reutilizable](./como-crear-componente-reutilizable.md)
- [Guía de diseño de componentes](./guia-de-diseno-completo.md)
- [Posicionamiento de objetos](../04-escena-3d/posicionamiento-de-objetos.md)