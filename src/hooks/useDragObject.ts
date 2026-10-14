import { useCallback, useRef, useState } from 'react';
import * as THREE from 'three';
import { useThree, type ThreeEvent } from '@react-three/fiber';
import type { RapierRigidBody } from '@react-three/rapier';

const setCursor = (cursor: string): void => {
  const canvas = document.querySelector<HTMLCanvasElement>('canvas');
  if (canvas) canvas.style.cursor = cursor;
};

/**
 * Hook que implementa drag físico de un RigidBody con el ratón.
 *
 * Funcionamiento:
 * 1. En `pointerDown` se captura el RigidBody clicado, se calcula el
 *     plano perpendicular a la cámara que pasa por el objeto y el offset
 *     entre el punto exacto del click y el centro del RigidBody.
 * 2. El RigidBody se cambia temporalmente a `kinematicPositionBased`
 *     para que pueda ser movido por código sin que las colisiones lo
 *     empujen.
 * 3. En `pointerMove` (mientras el botón está pulsado) se proyecta el
 *     ratón sobre el plano y se aplica `setNextKinematicTranslation`.
 * 4. En `pointerUp` se restaura a `dynamic` y se anulan las velocidades.
 *
 * El drag NO acumula velocidad: al soltar, el objeto reposa donde lo
 * dejaste, sin salir disparado.
 *
 * Estructura esperada en el árbol three.js:
 *   <RigidBody>
 *     <group onPointerDown={handlePointerDown}> ← aquí se monta el listener
 *       <mesh /> ← aquí se origina el evento
 *     </group>
 *   </RigidBody>
 *
 * @react-three/rapier adjunta `userData.rigidBody` al Object3D del
 * RigidBody, por lo que basta con subir hasta encontrarlo.
 */
export const useDragObject = () => {
  const { camera } = useThree();
  const [isDragging, setIsDragging] = useState(false);

  const dragPlane = useRef(new THREE.Plane());
  const dragOffset = useRef(new THREE.Vector3());
  const intersection = useRef(new THREE.Vector3());
  const rigidBodyRef = useRef<RapierRigidBody | null>(null);

  const raycaster = useRef(new THREE.Raycaster());
  const pointer = useRef(new THREE.Vector2());

  const handlePointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();

      let node: THREE.Object3D | null = e.object;
      while (node && !(node.userData as { rigidBody?: unknown })?.rigidBody) {
        node = node.parent;
      }
      const rb = (node?.userData as { rigidBody?: RapierRigidBody } | undefined)?.rigidBody;
      if (!rb) return;

      rigidBodyRef.current = rb;

      const pos = rb.translation();

      const planeNormal = new THREE.Vector3();
      camera.getWorldDirection(planeNormal).negate();
      dragPlane.current.setFromNormalAndCoplanarPoint(
        planeNormal,
        new THREE.Vector3(pos.x, pos.y, pos.z)
      );

      const worldPoint = e.point;
      dragOffset.current.set(
        worldPoint.x - pos.x,
        worldPoint.y - pos.y,
        worldPoint.z - pos.z
      );

      // KinematicPositionBased = 2 en Rapier.
      rb.setBodyType(2, true);

      setCursor('grabbing');
      setIsDragging(true);
    },
    [camera]
  );

  const handlePointerMove = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      const rb = rigidBodyRef.current;
      if (!rb || !isDragging) return;

      const canvas = document.querySelector<HTMLCanvasElement>('canvas');
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      pointer.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current.setFromCamera(pointer.current, camera);
      const ok = raycaster.current.ray.intersectPlane(
        dragPlane.current,
        intersection.current
      );

      if (ok) {
        rb.setNextKinematicTranslation({
          x: intersection.current.x - dragOffset.current.x,
          y: intersection.current.y - dragOffset.current.y,
          z: intersection.current.z - dragOffset.current.z,
        });
      }
    },
    [camera, isDragging]
  );

  const handlePointerUp = useCallback(() => {
    const rb = rigidBodyRef.current;
    if (!rb) return;

    // Dynamic = 0 en Rapier.
    rb.setBodyType(0, true);
    rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
    rb.setAngvel({ x: 0, y: 0, z: 0 }, true);

    rigidBodyRef.current = null;
    setCursor('grab');
    setIsDragging(false);
  }, []);

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    isDragging,
  };
};