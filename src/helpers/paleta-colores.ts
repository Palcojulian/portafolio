/**
 * Paleta de colores agrupada por gama.
 * Cada grupo define 5 tonos: 500 (más saturado/oscuro) → 100 (más claro).
 */
export type EscalaTonos = {
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
};

// A
export const rojos: EscalaTonos = {
  500: '#F94144',
  400: '#FA5457',
  300: '#FA6769',
  200: '#FB7A7C',
  100: '#FB8D8F',
};

// B
export const naranjaIntenso: EscalaTonos = {
  500: '#F3722C',
  400: '#F47E3F',
  300: '#F58B51',
  200: '#F69764',
  100: '#F7A476',
};

// C
export const naranja: EscalaTonos = {
  500: '#F8961E',
  400: '#F99F31',
  300: '#F9A844',
  200: '#FAB157',
  100: '#FABA6A',
};

// D
export const naranjaSuave: EscalaTonos = {
  500: '#F9844A',
  400: '#FA915D',
  300: '#FA9E70',
  200: '#FBAB83',
  100: '#FCB896',
};

// E
export const amarillos: EscalaTonos = {
  500: '#F9C74F',
  400: '#FACD62',
  300: '#FAD375',
  200: '#FBD988',
  100: '#FCDF9B',
};

// F
export const verdes: EscalaTonos = {
  500: '#90BE6D',
  400: '#9AC47B',
  300: '#A5CA88',
  200: '#AFD096',
  100: '#B9D6A3',
};

// G
export const verdeAgua: EscalaTonos = {
  500: '#43AA8B',
  400: '#49B796',
  300: '#57BD9E',
  200: '#65C2A6',
  100: '#73C8AF',
};

// H
export const verdePetroleo: EscalaTonos = {
  500: '#4D908E',
  400: '#549D9B',
  300: '#5CA8A6',
  200: '#69AFAD',
  100: '#76B6B4',
};

// I DARK
export const azulGrisOscuro: EscalaTonos = {
  500: '#405665',
  400: '#394C59',
  300: '#31424D',
  200: '#293841',
  100: '#222D35',
};

// I LIGHT
export const azulGrisClaro: EscalaTonos = {
  500: '#577589',
  400: '#5F7F95',
  300: '#68899F',
  200: '#7492A7',
  100: '#809CAE',
};

// J DARK
export const azulOscuro: EscalaTonos = {
  500: '#277DA1',
  400: '#2B89B1',
  300: '#2F96C1',
  200: '#35A1CE',
  100: '#45A8D2',
};

// J LIGHT
export const azulClaro: EscalaTonos = {
  500: '#54B0D6',
  400: '#64B7DA',
  300: '#74BEDD',
  200: '#84C6E1',
  100: '#94CDE5',
};

/** Todos los grupos en un solo objeto, útil para importar la paleta completa. */
export const paletaColores = {
  rojos,
  naranjaIntenso,
  naranja,
  naranjaSuave,
  amarillos,
  verdes,
  verdeAgua,
  verdePetroleo,
  azulGrisOscuro,
  azulGrisClaro,
  azulOscuro,
  azulClaro,
} as const;


export type NombrePaleta = keyof typeof paletaColores;
export type IntensidadColor = 100 | 200 | 300 | 400 | 500;
