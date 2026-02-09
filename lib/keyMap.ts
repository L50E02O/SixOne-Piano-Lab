/**
 * Mapa de teclas QWERTY a notas musicales.
 * Optimizado para teclados 60% (filas QWERTY y ASDF).
 * Dos octavas: C3-B3 (fila inferior) y C4-B4 (fila superior).
 */

export type NoteInfo = {
  note: string;
  frequency: number;
  octave: number;
  isBlack: boolean;
  keyLabel: string;
};

/**
 * Mapeo completo: tecla PC -> informacion de nota.
 * Evita ghosting mediante Set() en el handler.
 */
export const KEY_TO_NOTE: Record<string, NoteInfo> = {
  // Octava inferior (C3-B3): fila Z + modificadores
  z: {
    note: "C3",
    frequency: 130.81,
    octave: 3,
    isBlack: false,
    keyLabel: "Z",
  },
  s: {
    note: "C#3",
    frequency: 138.59,
    octave: 3,
    isBlack: true,
    keyLabel: "S",
  },
  x: {
    note: "D3",
    frequency: 146.83,
    octave: 3,
    isBlack: false,
    keyLabel: "X",
  },
  d: {
    note: "D#3",
    frequency: 155.56,
    octave: 3,
    isBlack: true,
    keyLabel: "D",
  },
  c: {
    note: "E3",
    frequency: 164.81,
    octave: 3,
    isBlack: false,
    keyLabel: "C",
  },
  v: {
    note: "F3",
    frequency: 174.61,
    octave: 3,
    isBlack: false,
    keyLabel: "V",
  },
  g: {
    note: "F#3",
    frequency: 185.0,
    octave: 3,
    isBlack: true,
    keyLabel: "G",
  },
  b: {
    note: "G3",
    frequency: 196.0,
    octave: 3,
    isBlack: false,
    keyLabel: "B",
  },
  h: {
    note: "G#3",
    frequency: 207.65,
    octave: 3,
    isBlack: true,
    keyLabel: "H",
  },
  n: {
    note: "A3",
    frequency: 220.0,
    octave: 3,
    isBlack: false,
    keyLabel: "N",
  },
  j: {
    note: "A#3",
    frequency: 233.08,
    octave: 3,
    isBlack: true,
    keyLabel: "J",
  },
  m: {
    note: "B3",
    frequency: 246.94,
    octave: 3,
    isBlack: false,
    keyLabel: "M",
  },

  // Octava superior (C4-B4): fila Q + modificadores
  q: {
    note: "C4",
    frequency: 261.63,
    octave: 4,
    isBlack: false,
    keyLabel: "Q",
  },
  2: {
    note: "C#4",
    frequency: 277.18,
    octave: 4,
    isBlack: true,
    keyLabel: "2",
  },
  w: {
    note: "D4",
    frequency: 293.66,
    octave: 4,
    isBlack: false,
    keyLabel: "W",
  },
  3: {
    note: "D#4",
    frequency: 311.13,
    octave: 4,
    isBlack: true,
    keyLabel: "3",
  },
  e: {
    note: "E4",
    frequency: 329.63,
    octave: 4,
    isBlack: false,
    keyLabel: "E",
  },
  r: {
    note: "F4",
    frequency: 349.23,
    octave: 4,
    isBlack: false,
    keyLabel: "R",
  },
  5: {
    note: "F#4",
    frequency: 369.99,
    octave: 4,
    isBlack: true,
    keyLabel: "5",
  },
  t: {
    note: "G4",
    frequency: 392.0,
    octave: 4,
    isBlack: false,
    keyLabel: "T",
  },
  6: {
    note: "G#4",
    frequency: 415.3,
    octave: 4,
    isBlack: true,
    keyLabel: "6",
  },
  y: {
    note: "A4",
    frequency: 440.0,
    octave: 4,
    isBlack: false,
    keyLabel: "Y",
  },
  7: {
    note: "A#4",
    frequency: 466.16,
    octave: 4,
    isBlack: true,
    keyLabel: "7",
  },
  u: {
    note: "B4",
    frequency: 493.88,
    octave: 4,
    isBlack: false,
    keyLabel: "U",
  },
  i: {
    note: "C5",
    frequency: 523.25,
    octave: 5,
    isBlack: false,
    keyLabel: "I",
  },
};

/** Teclas que activan notas (para evitar escuchar otras teclas) */
export const PIANO_KEYS = new Set(Object.keys(KEY_TO_NOTE));

/** Octava inferior (C3-B3): mano izquierda. Octava superior (C4-C5): mano derecha. */
const LEFT_HAND_KEYS = new Set(["z", "s", "x", "d", "c", "v", "g", "b", "h", "n", "j", "m"]);

/** Indica la mano que debe tocar la tecla (como en piano real) */
export function getHandForKey(key: string): "L" | "R" {
  const k = key.toLowerCase();
  return LEFT_HAND_KEYS.has(k) ? "L" : "R";
}

/** Obtiene la nota asociada a una tecla, normalizada a minuscula */
export function getNoteForKey(key: string): NoteInfo | null {
  const normalized = key.toLowerCase();
  return KEY_TO_NOTE[normalized] ?? null;
}
