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
    .select("id, title, description, sequence, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description ?? null,
    sequence: Array.isArray(row.sequence) ? row.sequence.map(String) : [],
    created_at: row.created_at,
  }));
}
