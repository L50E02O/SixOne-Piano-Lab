/**
 * Cliente de Supabase para el sistema de lecciones.
 * Requiere NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ExerciseDifficulty = "principiante" | "basico" | "intermedio" | "avanzado";

export type LessonExercise = {
  id: string;
  title: string;
  description: string | null;
  sequence: string[];
  difficulty: ExerciseDifficulty;
  sort_order: number | null;
  created_at: string;
};
