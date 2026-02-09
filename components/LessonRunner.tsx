"use client";

import type { LessonExercise } from "@/lib/supabase";
import { KEY_TO_NOTE } from "@/lib/keyMap";

export type LessonProgressProps = {
  exercise: LessonExercise | null;
  currentIndex: number;
  lastKeyCorrect: boolean | null;
  onReset: () => void;
};

/**
 * UI del progreso de la leccion: titulo, secuencia a seguir, indice actual, acierto/fallo.
 */
export function LessonProgress({
  exercise,
  currentIndex,
  lastKeyCorrect,
  onReset,
}: LessonProgressProps) {
  if (!exercise) {
    return (
      <section className="w-full max-w-2xl mx-auto mb-6 p-4 rounded-lg border border-piano-border bg-piano-black/50">
        <p className="text-sm text-zinc-500">
          Selecciona una leccion o crea ejercicios en Supabase (tabla exercises, campo sequence como array de teclas).
        </p>
      </section>
    );
  }

  const sequence = exercise.sequence;
  const isComplete = sequence.length > 0 && currentIndex >= sequence.length;
  const nextKey = sequence[currentIndex] ?? null;
  const noteLabel = nextKey ? KEY_TO_NOTE[nextKey]?.note ?? nextKey : null;

  return (
    <section className="w-full max-w-2xl mx-auto mb-6 p-4 rounded-lg border border-piano-border bg-piano-black/50">
      <div className="flex items-center justify-between gap-4 mb-3">
        <h2 className="text-lg font-semibold text-piano-white">
          {exercise.title}
        </h2>
        <button
          type="button"
          onClick={onReset}
          className="text-xs px-3 py-1.5 rounded bg-piano-border text-zinc-400 hover:bg-piano-border/80 hover:text-white transition-colors"
        >
          Reiniciar
        </button>
      </div>
      {exercise.description && (
        <p className="text-sm text-zinc-400 mb-3">{exercise.description}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        {sequence.map((key, i) => {
          const done = i < currentIndex;
          const current = i === currentIndex;
          const note = KEY_TO_NOTE[key]?.note ?? key;
          return (
            <span
              key={`${key}-${i}`}
              className={`
                inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded text-sm font-mono
                ${done ? "bg-green-900/50 text-green-300" : ""}
                ${current ? "bg-piano-active text-white ring-2 ring-piano-active/50" : ""}
                ${!done && !current ? "bg-piano-border/50 text-zinc-500" : ""}
              `}
            >
              {key.toUpperCase()} <span className="ml-1 text-[10px] opacity-80">({note})</span>
            </span>
          );
        })}
      </div>

      {isComplete ? (
        <p className="text-sm text-green-400">Secuencia completada.</p>
      ) : (
        <p className="text-sm text-zinc-400">
          Siguiente: <strong className="text-piano-white">{nextKey?.toUpperCase()}</strong>
          {noteLabel && ` (${noteLabel})`}
          {lastKeyCorrect === false && (
            <span className="ml-2 text-red-400">Tecla incorrecta.</span>
          )}
        </p>
      )}
    </section>
  );
}
