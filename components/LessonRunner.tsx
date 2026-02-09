"use client";

import type { LessonExercise } from "@/lib/supabase";
import { KEY_TO_NOTE, getHandForKey } from "@/lib/keyMap";

export type LessonProgressProps = {
  exercise: LessonExercise | null;
  currentIndex: number;
  lastKeyCorrect: boolean | null;
  onReset: () => void;
};

/** UI del progreso: título, secuencia con indicador de mano (L/R), acierto/fallo. */
export function LessonProgress({
  exercise,
  currentIndex,
  lastKeyCorrect,
  onReset,
}: LessonProgressProps) {
  if (!exercise) {
    return (
      <section className="w-full max-w-2xl mx-auto mb-6 p-5 rounded-xl border border-piano-border/80 bg-piano-black/60 backdrop-blur">
        <p className="text-sm text-zinc-500">
          Elige una lección para practicar. Las teclas Z–M son mano izquierda, Q–I mano derecha.
        </p>
      </section>
    );
  }

  const sequence = exercise.sequence;
  const isComplete = sequence.length > 0 && currentIndex >= sequence.length;
  const nextKey = sequence[currentIndex] ?? null;
  const noteLabel = nextKey ? KEY_TO_NOTE[nextKey]?.note ?? nextKey : null;
  const nextHand = nextKey ? getHandForKey(nextKey) : null;

  return (
    <section className="w-full max-w-2xl mx-auto mb-6 p-5 rounded-xl border border-piano-border/80 bg-piano-black/60 backdrop-blur">
      <div className="flex items-center justify-between gap-4 mb-3">
        <h2 className="text-lg font-semibold text-piano-white">
          {exercise.title}
        </h2>
        <button
          type="button"
          onClick={onReset}
          className="text-xs px-3 py-1.5 rounded-lg bg-piano-border/80 text-zinc-400 hover:bg-piano-border hover:text-white transition-colors"
        >
          Reiniciar
        </button>
      </div>
      {exercise.description && (
        <p className="text-sm text-zinc-400 mb-4">{exercise.description}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {sequence.map((key, i) => {
          const done = i < currentIndex;
          const current = i === currentIndex;
          const note = KEY_TO_NOTE[key]?.note ?? key;
          const hand = getHandForKey(key);
          const handColor = hand === "L" ? "text-piano-left" : "text-piano-right";
          return (
            <span
              key={`${key}-${i}`}
              className={`
                inline-flex items-center gap-1 min-w-[2.5rem] px-2 py-1 rounded-lg text-sm font-mono
                ${done ? "bg-green-900/40 text-green-300" : ""}
                ${current ? "bg-piano-active text-white ring-2 ring-piano-active/50" : ""}
                ${!done && !current ? "bg-piano-border/40 text-zinc-500" : ""}
              `}
            >
              <span className={`text-[10px] font-bold ${current ? "" : handColor}`}>
                {hand}
              </span>
              {key.toUpperCase()} <span className="ml-0.5 text-[10px] opacity-70">({note})</span>
            </span>
          );
        })}
      </div>

      {isComplete ? (
        <p className="text-sm text-green-400 font-medium">¡Secuencia completada!</p>
      ) : (
        <p className="text-sm text-zinc-400">
          Siguiente:{" "}
          <strong className="text-piano-white">{nextKey?.toUpperCase()}</strong>
          {noteLabel && ` (${noteLabel})`}
          {nextHand && (
            <span
              className={`ml-2 font-semibold ${
                nextHand === "L" ? "text-piano-left" : "text-piano-right"
              }`}
            >
              mano {nextHand === "L" ? "izquierda" : "derecha"}
            </span>
          )}
          {lastKeyCorrect === false && (
            <span className="ml-2 text-red-400">— Tecla incorrecta</span>
          )}
        </p>
      )}
    </section>
  );
}
