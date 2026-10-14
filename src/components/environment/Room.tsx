/**
 * Habitación que da contexto a la escena.
 *
 * Construye un despacho minimalista alrededor del escritorio:
 *
 * - **Suelo**: se renderiza por separado en `Floor.tsx` (dentro de
 *   <Physics>) porque necesita ser un cuerpo físico fijo para que
 *   recoja los RigidBody dinámicos que caigan fuera del escritorio.
 * - **Pared trasera**: pared gris claro detrás del escritorio. Es la
 *   zona más prominente del fondo y sirve como anclaje visual.
 * - **Paredes laterales**: paredes izquierda y derecha en un tono
 *   ligeramente más oscuro, para enmarcar la escena.
 * - **Alfombra**: círculo bajo el escritorio, centrada en el origen.
 *   Aporta calidez y profundidad visual.
 *
 * Todos los elementos son fijos (no responden a físicas) y están
 * ligeramente separados del escritorio para evitar z-fighting.
 */
const Room = () => {
  return (
    <group>
      {/* Alfombra circular bajo el escritorio, centrada */}
      <mesh receiveShadow position={[0, -0.495, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.8, 64]} />
        <meshStandardMaterial color="#3a3a4a" roughness={0.95} metalness={0} />
      </mesh>

      {/* Pared trasera */}
      <mesh receiveShadow position={[0, 3, -5]}>
        <boxGeometry args={[14, 7, 0.2]} />
        <meshStandardMaterial color="#e8e4dc" roughness={0.9} metalness={0} />
      </mesh>

      {/* Pared izquierda */}
      <mesh receiveShadow position={[-7, 3, 0]}>
        <boxGeometry args={[0.2, 7, 10]} />
        <meshStandardMaterial color="#d8d4cc" roughness={0.9} metalness={0} />
      </mesh>

      {/* Pared derecha */}
      <mesh receiveShadow position={[7, 3, 0]}>
        <boxGeometry args={[0.2, 7, 10]} />
        <meshStandardMaterial color="#d8d4cc" roughness={0.9} metalness={0} />
      </mesh>
    </group>
  );
};

export default Room;