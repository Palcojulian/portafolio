import { Mesh, MeshStandardMaterial } from 'three';
import { useGLTF } from '@react-three/drei';
import RigidObject from '../physics/RigidObject';
import { BULKY_DENSITY } from '../physics/density';
import { paletaColores } from '../../helpers/paleta-colores';

/**
 * Lámpara. Cuerpo físico dinámico.
 *
 * El .glb NO incluye materiales (verified: `materials: []` en el JSON
 * del GLB). Por eso usamos el **patrón manual**: creamos un
 * `MeshStandardMaterial` por cada malla y asignamos colores de la
 * paleta del proyecto.
 *
 * Las 7 mallas del .glb son:
 * - `baseLamp`: base metálica oscura
 * - `bombilloPart1/2/3`: vidrio de la bombilla (amarillo cálido)
 * - `exteriorLamp`: pantalla exterior (beige)
 * - `interiorLamp`: pantalla interior (blanco reflectante)
 * - `soporteLamp`: soporte (gris medio)
 */
const Model = () => {
  const { nodes } = useGLTF('/3d-models/lamp.glb');

  // Materiales asignados manualmente.
  const baseMaterial = new MeshStandardMaterial({
    color: paletaColores.azulGrisOscuro[400],
    roughness: 0.4,
    metalness: 0.7,
  });
  const bombilloMaterial = new MeshStandardMaterial({
    color: paletaColores.amarillos[300],
    emissive: paletaColores.amarillos[500],
    emissiveIntensity: 0.6,
    roughness: 0.2,
    metalness: 0,
  });
  const exteriorMaterial = new MeshStandardMaterial({
    color: paletaColores.naranjaSuave[200],
    roughness: 0.7,
    metalness: 0,
  });
  const interiorMaterial = new MeshStandardMaterial({
    color: '#ffffff',
    roughness: 0.3,
    metalness: 0.3,
  });
  const soporteMaterial = new MeshStandardMaterial({
    color: paletaColores.azulGrisClaro[400],
    roughness: 0.4,
    metalness: 0.6,
  });

  return (
    <RigidObject
      type="dynamic"
      sound="metal"
      colliders="cuboid"
      density={BULKY_DENSITY}
      position={[2, 1.47, -0.3]}
      scale={1.5}
      rotation={[0, 5.5, 0]}
    >
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.baseLamp as Mesh).geometry}
        material={baseMaterial}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.bombilloPart1 as Mesh).geometry}
        material={bombilloMaterial}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.bombilloPart2 as Mesh).geometry}
        material={bombilloMaterial}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.BombilloPart3 as Mesh).geometry}
        material={bombilloMaterial}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.exteriorLamp as Mesh).geometry}
        material={exteriorMaterial}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.interiorLamp as Mesh).geometry}
        material={interiorMaterial}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.soporteLamp as Mesh).geometry}
        material={soporteMaterial}
      />
    </RigidObject>
  );
};

useGLTF.preload('/3d-models/lamp.glb');

export default Model;