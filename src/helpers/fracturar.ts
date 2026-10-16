import { Mesh, Quaternion, Vector3, type BufferGeometry, type Object3D } from 'three';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';
import { ConvexObjectBreaker } from 'three/examples/jsm/misc/ConvexObjectBreaker.js';

export interface Pose {
  position: Vector3;
  quaternion: Quaternion;
  velocity: Vector3;
}

export interface Fragmento {
  geometry: BufferGeometry;
  /** Posición en mundo del centro del fragmento. */
  position: Vector3;
  quaternion: Quaternion;
  /** Velocidad inicial en mundo. */
  velocity: Vector3;
}

/**
 * Parte un modelo en fragmentos convexos.
 *
 * 1. Envolvente convexa de todos los vértices del modelo
 *    (`ConvexGeometry`), escalada como se renderizaba.
 * 2. `ConvexObjectBreaker.subdivideByImpact` la corta alrededor de un
 *    punto de la base (donde golpea el suelo).
 * 3. Cada fragmento hereda la pose del objeto, parte de su velocidad y
 *    un pequeño empuje hacia fuera y hacia arriba.
 *
 * Usa `Math.random`, así que debe llamarse desde un manejador de evento,
 * no durante el render.
 */
export const fracturar = (model: Object3D, scale: number, pose: Pose): Fragmento[] => {
  const points: Vector3[] = [];
  model.updateMatrixWorld(true);
  model.traverse((obj) => {
    const mesh = obj as Mesh;
    if (!mesh.isMesh) return;
    const attr = mesh.geometry.getAttribute('position');
    for (let i = 0; i < attr.count; i++) {
      points.push(
        new Vector3()
          .fromBufferAttribute(attr, i)
          .applyMatrix4(mesh.matrixWorld)
          .multiplyScalar(scale)
      );
    }
  });

  const hull = new Mesh(new ConvexGeometry(points));
  const breaker = new ConvexObjectBreaker();
  breaker.prepareBreakableObject(hull, 1, new Vector3(), new Vector3(), true);

  const impact = new Vector3(
    (Math.random() - 0.5) * 0.08,
    0.01,
    (Math.random() - 0.5) * 0.08
  );
  const debris = breaker.subdivideByImpact(hull, impact, new Vector3(0, 1, 0), 2, 1);
  hull.geometry.dispose();

  return debris.map((piece) => {
    const local = piece.position.clone();
    const outward = new Vector3(local.x, 0, local.z).normalize().applyQuaternion(pose.quaternion);
    return {
      geometry: (piece as Mesh).geometry,
      position: local.applyQuaternion(pose.quaternion).add(pose.position),
      quaternion: pose.quaternion.clone(),
      velocity: new Vector3(
        pose.velocity.x * 0.3,
        0.8 + Math.random(),
        pose.velocity.z * 0.3
      ).addScaledVector(outward, 0.6 + Math.random() * 0.9),
    };
  });
};
