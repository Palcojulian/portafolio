/**
 * Decoración de pared: un cuadro abstracto minimalista.
 *
 * Compuesto por un marco (caja plana) y un "lienzo" interior
 * con dos rectángulos de color que evocan un cuadro moderno.
 *
 * Se coloca sobre la pared trasera, ligeramente a la izquierda
 * del escritorio, para no robar protagonismo al monitor.
 *
 * No es interactivo. No responde a físicas.
 */
const WallDecor = () => {
  return (
    <group position={[-3, 3.5, -4.85]}>
      {/* Marco */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.2, 1.6, 0.05]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Lienzo (fondo) */}
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[2, 1.4]} />
        <meshStandardMaterial color="#e8e4dc" roughness={0.9} metalness={0} />
      </mesh>

      {/* Composición abstracta: bloque grande + bloque pequeño */}
      <mesh position={[-0.4, -0.1, 0.04]}>
        <planeGeometry args={[0.9, 0.7]} />
        <meshStandardMaterial color="#577589" roughness={0.7} metalness={0} />
      </mesh>
      <mesh position={[0.45, 0.25, 0.05]}>
        <planeGeometry args={[0.5, 0.4]} />
        <meshStandardMaterial color="#F9C74F" roughness={0.7} metalness={0} />
      </mesh>
    </group>
  );
};

export default WallDecor;