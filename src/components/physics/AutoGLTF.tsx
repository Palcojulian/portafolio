import type { ReactNode } from 'react';
import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import type { Object3D, Mesh as ThreeMesh } from 'three';

/**
 * Carga un `.glb` y renderiza automáticamente todas sus mallas.
 *
 * Útil cuando el `.glb` tiene muchas mallas (como el teclado con 102
 * teclas) y hardcodear cada una en TSX sería absurdo.
 *
 * @param url - Ruta al `.glb` (por ejemplo '/3d-models/keyboard.glb').
 * @param filterMesh - Opcional: nombre o predicado para incluir sólo
 *                    ciertas mallas. Útil cuando un .glb tiene partes
 *                    que no quieres renderizar.
 *
 * El componente recorre `scene.traverse()` y crea un `<mesh>` por cada
 * `Object3D` que sea `Mesh`. Aplica sombras y mantiene los materiales
 * originales del GLB.
 */
interface AutoGLTFProps {
  url: string;
  filterMesh?: (name: string) => boolean;
}

const AutoGLTF = ({ url, filterMesh }: AutoGLTFProps) => {
  const gltf = useGLTF(url);

  const meshes = useMemo(() => {
    const found: ThreeMesh[] = [];
    gltf.scene.traverse((obj: Object3D) => {
      const mesh = obj as ThreeMesh;
      if (mesh.isMesh && (!filterMesh || filterMesh(mesh.name))) {
        found.push(mesh);
      }
    });
    return found;
  }, [gltf, filterMesh]);

  return (
    <>
      {meshes.map((mesh, i) => (
        <mesh
          key={i}
          castShadow
          receiveShadow
          geometry={mesh.geometry}
          material={mesh.material}
        />
      ))}
    </>
  );
};

/**
 * Variante que envuelve automáticamente todos los meshes en un <group>
 * (no retorna un fragment, sino un solo elemento root). Útil cuando
 * necesitas pasarlo como child de algo que espera un único elemento.
 */
interface AutoGLTFGroupProps extends AutoGLTFProps {
  children?: ReactNode;
}

export const AutoGLTFGroup = ({ url, filterMesh, children }: AutoGLTFGroupProps) => {
  return (
    <>
      <AutoGLTF url={url} filterMesh={filterMesh} />
      {children}
    </>
  );
};

export default AutoGLTF;