import type { ReactNode } from 'react';
import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import { Quaternion, Vector3 } from 'three';
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
 * `Object3D` que sea `Mesh`. Aplica sombras, mantiene los materiales
 * originales del GLB y conserva la transformación de cada nodo
 * (incluida la heredada de sus padres) relativa a la raíz del GLB.
 */
interface AutoGLTFProps {
  url: string;
  filterMesh?: (name: string) => boolean;
}

const AutoGLTF = ({ url, filterMesh }: AutoGLTFProps) => {
  const gltf = useGLTF(url);

  const meshes = useMemo(() => {
    const found: {
      mesh: ThreeMesh;
      position: Vector3;
      quaternion: Quaternion;
      scale: Vector3;
    }[] = [];
    gltf.scene.updateMatrixWorld(true);
    gltf.scene.traverse((obj: Object3D) => {
      const mesh = obj as ThreeMesh;
      if (mesh.isMesh && (!filterMesh || filterMesh(mesh.name))) {
        const position = new Vector3();
        const quaternion = new Quaternion();
        const scale = new Vector3();
        mesh.matrixWorld.decompose(position, quaternion, scale);
        found.push({ mesh, position, quaternion, scale });
      }
    });
    return found;
  }, [gltf, filterMesh]);

  return (
    <>
      {meshes.map(({ mesh, position, quaternion, scale }) => (
        <mesh
          key={mesh.uuid}
          castShadow
          receiveShadow
          geometry={mesh.geometry}
          material={mesh.material}
          position={position}
          quaternion={quaternion}
          scale={scale}
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