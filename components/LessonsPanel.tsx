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
}: LessonsPanelProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-4">
      <div className="flex items-center justify-between gap-2 mb-2">
        <button
          type="button"
          onClick={() => onOpenChange(!isOpen)}
          className={`
            px-3 py-2 rounded-lg text-sm font-medium transition-colors
            ${isOpen
              ? "bg-piano-border text-zinc-400 hover:bg-piano-border/80 hover:text-white"
              : "bg-piano-active text-white hover:bg-piano-active/90"}
          `}
        >
          {isOpen ? "Cerrar lecciones" : "Abrir lecciones"}
        </button>
        {!isOpen && (
          <span className="text-xs text-zinc-500">
            Modo solo piano
          </span>
        )}
      </div>

      {isOpen && (
        <>
          {exercises.length > 0 ? (
            <div className="mb-4">
              <p className="text-xs text-zinc-500 mb-2">Elige un ejercicio</p>
              <div className="flex flex-wrap gap-2">
                {exercises.map((ex) => (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => onSelectExercise(ex)}
                    className={`
                      px-3 py-1.5 rounded text-sm font-medium transition-colors
                      ${selectedExercise?.id === ex.id
                        ? "bg-piano-active text-white"
                        : "bg-piano-border text-zinc-400 hover:bg-piano-border/80 hover:text-white"}
                    `}
                  >
                    {ex.title}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-zinc-500 mb-2">
              Sin ejercicios. Anade algunos en Supabase (tabla exercises).
            </p>
          )}

          <LessonProgress
            exercise={selectedExercise}
            currentIndex={lessonIndex}
            lastKeyCorrect={lastKeyCorrect}
            onReset={onReset}
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
