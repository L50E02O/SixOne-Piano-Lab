"use client";

import type { LessonExercise } from "@/lib/supabase";
import { LessonProgress } from "@/components/LessonRunner";

const LESSONS_PANEL_KEY = "piano-lab-lessons-open";

export type LessonsPanelProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  exercises: LessonExercise[];
  selectedExercise: LessonExercise | null;
  onSelectExercise: (ex: LessonExercise) => void;
  lessonIndex: number;
  lastKeyCorrect: boolean | null;
  onReset: () => void;
  activeKeys?: Set<string>;
};

/**
 * Panel de lecciones colapsable. Inspirado en apps como Sightread (Free play vs Learn)
 * y Flowkey: modo lecciones vs solo piano.
 */
export function LessonsPanel({
  isOpen,
  onOpenChange,
  exercises,
  selectedExercise,
  onSelectExercise,
  lessonIndex,
  lastKeyCorrect,
  onReset,
  activeKeys = new Set(),
}: LessonsPanelProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      <div className="flex items-center justify-between gap-2 mb-3">
        <button
          type="button"
          onClick={() => onOpenChange(!isOpen)}
          className={`
            px-4 py-2 rounded-xl text-sm font-medium transition-all
            ${isOpen
              ? "bg-piano-border/80 text-zinc-400 hover:bg-piano-border hover:text-white"
              : "bg-piano-active text-white hover:bg-piano-activeDim"}
          `}
        >
          {isOpen ? "Cerrar lecciones" : "Abrir lecciones"}
        </button>
        {!isOpen && (
          <span className="text-xs text-zinc-500">Modo solo piano</span>
        )}
      </div>

      {isOpen && (
        <>
          {exercises.length > 0 ? (
            <div className="mb-4">
              <p className="text-xs text-zinc-500 mb-2">
                Ubicación de teclas (Do Re Mi) y acordes mayores/menores
              </p>
              <div className="flex flex-wrap gap-2">
                {exercises.map((ex) => (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => onSelectExercise(ex)}
                    className={`
                      px-3 py-2 rounded-xl text-sm font-medium transition-all inline-flex items-center gap-2
                      ${selectedExercise?.id === ex.id
                        ? "bg-piano-active text-white shadow-md"
                        : "bg-piano-border/60 text-zinc-400 hover:bg-piano-border hover:text-white"}
                    `}
                  >
                    <span>{ex.title}</span>
                    <span
                      className={`
                        text-[10px] px-1.5 py-0.5 rounded-md uppercase font-semibold
                        ${ex.difficulty === "principiante" ? "bg-green-900/50 text-green-300" : ""}
                        ${ex.difficulty === "basico" ? "bg-blue-900/50 text-blue-300" : ""}
                        ${ex.difficulty === "intermedio" ? "bg-amber-900/50 text-amber-300" : ""}
                        ${ex.difficulty === "avanzado" ? "bg-red-900/50 text-red-300" : ""}
                      `}
                    >
                      {ex.difficulty}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-zinc-500 mb-2">
              Sin ejercicios. Añade algunos en Supabase (tabla exercises).
            </p>
          )}

          <LessonProgress
            exercise={selectedExercise}
            currentIndex={lessonIndex}
            lastKeyCorrect={lastKeyCorrect}
            onReset={onReset}
            activeKeys={activeKeys}
          />
        </>
      )}
    </div>
  );
}

/**
 * Lee la preferencia de panel desde localStorage (solo en cliente).
 */
export function getInitialLessonsOpen(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const v = localStorage.getItem(LESSONS_PANEL_KEY);
    return v !== "false";
  } catch {
    return true;
  }
}

/**
 * Guarda la preferencia de panel en localStorage.
 */
export function setLessonsOpenPersisted(open: boolean): void {
  try {
    localStorage.setItem(LESSONS_PANEL_KEY, String(open));
  } catch {
    // Ignorar si storage no disponible
  }
}
