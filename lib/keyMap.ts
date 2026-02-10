/**
 * Mapa de teclas QWERTY a una octava piano Do–Do.
 * Blancas: A–K (Do Re Mi Fa Sol La Si Do). Negras: fila superior Q–T.
 */

export type NoteInfo = {
  note: string;
  frequency: number;
  octave: number;
  isBlack: boolean;
  keyLabel: string;
  /** Solfeo: Do, Re, Mi, Fa, Sol, La, Si; sostenidos: Do#, Re#, etc. */
  solfeo: string;
};

const OCTAVE = 4;
const FREQ: Record<string, number> = {
  C: 261.63,
  "C#": 277.18,
  D: 293.66,
  "D#": 311.13,
  E: 329.63,
  F: 349.23,
  "F#": 369.99,
  G: 392.0,
  "G#": 415.3,
  A: 440.0,
  "A#": 466.16,
  B: 493.88,
};
const SOLFEO_WHITE: Record<string, string> = {
  C: "Do",
  D: "Re",
  E: "Mi",
  F: "Fa",
  G: "Sol",
  A: "La",
  B: "Si",
};
const SOLFEO_BLACK: Record<string, string> = {
  "C#": "Do#",
  "D#": "Re#",
  "F#": "Fa#",
  "G#": "Sol#",
  "A#": "La#",
};

function noteInfo(
  name: string,
  keyLabel: string,
  isBlack: boolean
): NoteInfo {
  const base = name.replace(/\d+$/, "");
  return {
    note: name,
    frequency: FREQ[base] ?? 0,
    octave: OCTAVE,
    isBlack,
    keyLabel,
    solfeo: isBlack ? SOLFEO_BLACK[base] ?? base : SOLFEO_WHITE[base] ?? base,
  };
}

/**
 * Una octava: blancas A–K, negras Q–T.
 * A=Do, S=Re, D=Mi, F=Fa, G=Sol, H=La, J=Si, K=Do.
 * Q=Do#, W=Re#, E=Fa#, R=Sol#, T=La#.
 */
export const KEY_TO_NOTE: Record<string, NoteInfo> = {
  a: noteInfo("C4", "A", false),
  s: noteInfo("D4", "S", false),
  d: noteInfo("E4", "D", false),
  f: noteInfo("F4", "F", false),
  g: noteInfo("G4", "G", false),
  h: noteInfo("A4", "H", false),
  j: noteInfo("B4", "J", false),
  k: noteInfo("C5", "K", false),
  q: noteInfo("C#4", "Q", true),
  w: noteInfo("D#4", "W", true),
  e: noteInfo("F#4", "E", true),
  r: noteInfo("G#4", "R", true),
  t: noteInfo("A#4", "T", true),
};

/** Teclas que activan notas (evitar ghosting) */
export const PIANO_KEYS = new Set(Object.keys(KEY_TO_NOTE));

/** Orden visual en el piano: blancas y negras intercaladas (C, C#, D, D#, …) */
export const NOTE_ORDER: string[] = [
  "a", "q", "s", "w", "d", "f", "e", "g", "r", "h", "t", "j", "k",
];

/** Indica mano sugerida: teclas a la izquierda = L, derecha = R (mitad del teclado) */
export function getHandForKey(key: string): "L" | "R" {
  const leftKeys = new Set(["a", "q", "s", "w", "d", "f"]);
  return leftKeys.has(key.toLowerCase()) ? "L" : "R";
}

export function getNoteForKey(key: string): NoteInfo | null {
  const normalized = key.toLowerCase();
  return KEY_TO_NOTE[normalized] ?? null;
}

/** Devuelve las teclas (keys) que forman un acorde mayor en posición fundamental. Raíz en notación: C, D, E, F, G, A, B. */
export function getMajorChordKeys(root: string): string[] {
  const whiteOrder = ["a", "s", "d", "f", "g", "h", "j", "k"];
  const roots: Record<string, number> = {
    C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6,
  };
  const i = roots[root] ?? 0;
  const third = (i + 2) % 7;
  const fifth = (i + 4) % 7;
  return [whiteOrder[i], whiteOrder[third], whiteOrder[fifth]];
}

/**
 * Teclas para acordes menores (raíz, 3.ª menor, 5.ª).
 * Usa negras donde corresponde: Cm=C-Eb-G, Dm=D-F-A, etc.
 */
const MINOR_CHORD_KEYS: Record<string, string[]> = {
  C: ["a", "w", "g"],   // C Eb G
  D: ["s", "f", "h"],   // D F A
  E: ["d", "g", "j"],   // E G B
  F: ["f", "r", "k"],   // F Ab C
  G: ["g", "t", "s"],   // G Bb D
  A: ["h", "a", "d"],   // A C E
  B: ["j", "s", "e"],   // B D F#
};

export function getMinorChordKeys(root: string): string[] {
  return MINOR_CHORD_KEYS[root] ?? [];
}
