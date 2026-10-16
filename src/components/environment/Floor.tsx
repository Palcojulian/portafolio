import { RigidBody } from '@react-three/rapier';

/**
 * Suelo físico de la habitación.
 *
 * Es un plano amplio con material de madera clara, envuelto en un
 * `RigidBody type="fixed"` para que los objetos dinámicos que caigan
 * fuera del escritorio reposen sobre él y no atraviesen el suelo.
 *
 * DEBE estar dentro de un `<Physics>`, si no rapier no encuentra el
 * contexto y lanza `useRapier must be used within <Physics />`.
 *
 * `userData.surface = 'floor'` permite a `useFloorImpact` reconocerlo
 * para reproducir sonidos y romper la taza.
 */
const Floor = () => {
  return (
    <RigidBody type="fixed" colliders="cuboid" userData={{ surface: 'floor' }}>
      <mesh receiveShadow position={[0, -0.51, 0]}>
        <boxGeometry args={[20, 0.02, 20]} />
        <meshStandardMaterial color="#c8a878" roughness={0.85} metalness={0.05} />
      </mesh>
    </RigidBody>
  );
};

export default Floor;