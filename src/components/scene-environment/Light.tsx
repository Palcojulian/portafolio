import { useRef } from 'react';
import type { DirectionalLight } from 'three';

/**
 * Intensidades de la iluminación general.
 *
 * La escena es **tenue, de atardecer** (fría y poco intensa) para que las
 * luces del coche (faros, pilotos, direccionales; ver `DrivableVehicle`)
 * y la bombilla de la lámpara contrasten. Para una escena de día,
 * multiplica estos valores por ~3 (eran 0,4 / 2,5 / 0,5).
 */
const AMBIENT_INTENSITY = 0.15;
const MAIN_INTENSITY = 0.8;
const FILL_INTENSITY = 0.15;

/**
 * Sistema de iluminación de la escena.
 *
 * Configura tres luces para una escena interior tenue:
 *
 * 1. **ambientLight**: luz suave de relleno para evitar zonas 100% oscuras.
 * 2. **directionalLight principal**: simula una lámpara de techo cenital,
 *    con sombras nítidas. Cubre todo el área del escritorio.
 * 3. **directionalLight de relleno**: luz tenue desde el lado opuesto,
 *    sin sombras, para suavizar el contraste.
 *
 * La cámara de sombras está dimensionada para cubrir la habitación entera
 * (8 unidades a cada lado desde el centro), por lo que cualquier objeto
 * sobre el escritorio proyectará sombra correctamente.
 */
const Light = () => {
  const refLight = useRef<DirectionalLight>(null!);

  return (
    <>
      {/* Luz ambiental fría y suave para que las zonas oscuras no sean totalmente negras */}
      <ambientLight intensity={AMBIENT_INTENSITY} color="#b8c4ff" />

      {/* Luz principal con sombras */}
      <directionalLight
        ref={refLight}
        intensity={MAIN_INTENSITY}
        color="#dfe4ff"
        position={[5, 8, 5]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-camera-near={0.5}
        shadow-camera-far={30}
        shadow-bias={-0.0005}
      />

      {/* Luz de relleno desde el lado contrario (sin sombras) */}
      <directionalLight intensity={FILL_INTENSITY} color="#c8d4ff" position={[-3, 4, -3]} />
    </>
  );
};

export default Light;
