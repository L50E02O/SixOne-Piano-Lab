/**
 * Ejercicios integrados para dominar ubicación de teclas (Do Re Mi) y acordes.
 * Métodos: secuencia de notas, acordes en posición fundamental (visual + práctica).
 */

import type { LessonExercise } from "./supabase";
import { getMajorChordKeys, getMinorChordKeys } from "./keyMap";

/** Identifica si un paso es un acorde (varias teclas a la vez). */
export function isChordStep(step: string): boolean {
  return step.includes(",");
}

/** Parsea un paso: una tecla o un conjunto de teclas (acorde). */
export function parseStep(step: string): string[] {
  return step.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
}

/** Ejercicios integrados: notas y acordes (una octava A–K, negras Q–T). */
export const BUILTIN_EXERCISES: LessonExercise[] = [
  {
    id: "builtin-do-re-mi",
    title: "Ubicación Do Re Mi Fa Sol La Si Do",
    description: "Toca la escala de Do en orden. Blancas: A=Do, S=Re, D=Mi, F=Fa, G=Sol, H=La, J=Si, K=Do.",
    sequence: ["a", "s", "d", "f", "g", "h", "j", "k"],
    difficulty: "principiante",
    sort_order: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "builtin-acordes-mayores",
    title: "Acordes mayores (Do, Fa, Sol)",
    description: "Toca las tres notas de cada acorde a la vez. Do = A+D+G, Fa = F+H+K, Sol = G+J+S.",
    sequence: [
      getMajorChordKeys("C").join(","),
      getMajorChordKeys("F").join(","),
      getMajorChordKeys("G").join(","),
    ],
    difficulty: "basico",
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "builtin-acordes-mayores-escala",
    title: "Acordes mayores (todos)",
    description: "Practica Do, Re, Mi, Fa, Sol, La y Si mayores en posición fundamental.",
    sequence: ["C", "D", "E", "F", "G", "A", "B"].map((root) =>
      getMajorChordKeys(root).join(",")
    ),
    difficulty: "intermedio",
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "builtin-acordes-menores",
    title: "Acordes menores (Do, Re, La)",
    description: "Do menor, Re menor y La menor. Incluyen teclas negras (Q, W, E, R, T).",
    sequence: [
      getMinorChordKeys("C").join(","),
      getMinorChordKeys("D").join(","),
      getMinorChordKeys("A").join(","),
    ],
    difficulty: "basico",
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
];

/** Orden de dificultad para ordenar listas. */
const DIFF_ORDER: Record<string, number> = {
  principiante: 0,
  basico: 1,
  intermedio: 2,
  avanzado: 3,
};

/**
 * Combina ejercicios integrados con los de Supabase (integrados primero).
 */
export function mergeExercises(remote: LessonExercise[]): LessonExercise[] {
  const byId = new Map<string, LessonExercise>();
  for (const ex of BUILTIN_EXERCISES) {
    byId.set(ex.id, ex);
  }
  for (const ex of remote) {
    if (!byId.has(ex.id)) byId.set(ex.id, ex);
  }
  return Array.from(byId.values()).sort((a, b) => {
    const orderA = a.sort_order ?? 100;
    const orderB = b.sort_order ?? 100;
    if (orderA !== orderB) return orderA - orderB;
    return (DIFF_ORDER[a.difficulty] ?? 0) - (DIFF_ORDER[b.difficulty] ?? 0);
  });
}
