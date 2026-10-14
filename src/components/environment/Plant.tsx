/**
 * Planta decorativa en la esquina del despacho.
 *
 * Composición geométrica sencilla:
 *
 * - **Maceta**: cilindro marrón oscuro, anclada al suelo.
 * - **Tierra**: cilindro más pequeño en la parte superior de la maceta.
 * - **Hojas**: varias esferas verdes de distintos tamaños formando
 *   una copa rudimentaria. Sin animación.
 *
 * Es un elemento puramente decorativo. No es interactivo y no
 * responde a físicas.
 */
const Plant = () => {
  return (
    <group position={[-5.5, -0.5, -3]}>
      {/* Maceta */}
      <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.4, 0.3, 0.8, 16]} />
        <meshStandardMaterial color="#5c3a1e" roughness={0.9} metalness={0} />
      </mesh>

      {/* Tierra */}
      <mesh position={[0, 0.81, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.02, 16]} />
        <meshStandardMaterial color="#3a2510" roughness={1} metalness={0} />
      </mesh>

      {/* Copa de hojas: varias esferas escalonadas */}
      <mesh castShadow position={[0, 1.4, 0]}>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshStandardMaterial color="#3d8b54" roughness={0.8} metalness={0} />
      </mesh>
      <mesh castShadow position={[0.35, 1.6, 0.1]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#4a9b5e" roughness={0.8} metalness={0} />
      </mesh>
      <mesh castShadow position={[-0.3, 1.7, -0.2]}>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshStandardMaterial color="#357d48" roughness={0.8} metalness={0} />
      </mesh>
      <mesh castShadow position={[0.1, 1.95, 0.05]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#52a865" roughness={0.8} metalness={0} />
      </mesh>
    </group>
  );
};

export default Plant;