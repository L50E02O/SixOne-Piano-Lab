/**
 * Carga de ejercicios desde Supabase para el sistema de lecciones.
 */

import { supabase } from "./supabase";
import type { LessonExercise } from "./supabase";

/**
 * Obtiene todos los ejercicios disponibles (lectura publica).
 */
export async function fetchExercises(): Promise<LessonExercise[]> {
  const { data, error } = await supabase
    .from("exercises")
    .select("id, title, description, sequence, difficulty, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const order: Record<string, number> = { principiante: 0, basico: 1, intermedio: 2, avanzado: 3 };
  return (data ?? [])
    .map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description ?? null,
      sequence: Array.isArray(row.sequence) ? row.sequence.map(String) : [],
      difficulty: (row.difficulty ?? "principiante") as LessonExercise["difficulty"],
      created_at: row.created_at,
    }))
    .sort((a, b) => (order[a.difficulty] ?? 0) - (order[b.difficulty] ?? 0));
}
