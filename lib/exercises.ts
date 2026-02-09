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
    .select("id, title, description, sequence, difficulty, sort_order, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const diffOrder: Record<string, number> = { principiante: 0, basico: 1, intermedio: 2, avanzado: 3 };
  return (data ?? [])
    .map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description ?? null,
      sequence: Array.isArray(row.sequence) ? row.sequence.map(String) : [],
      difficulty: (row.difficulty ?? "principiante") as LessonExercise["difficulty"],
      sort_order: row.sort_order ?? 100,
      created_at: row.created_at,
    }))
    .sort((a, b) => {
      const byOrder = (a.sort_order ?? 100) - (b.sort_order ?? 100);
      if (byOrder !== 0) return byOrder;
      return (diffOrder[a.difficulty] ?? 0) - (diffOrder[b.difficulty] ?? 0);
    });
}
