"use client";

import { useState, useCallback, useEffect } from "react";
import { KeyboardMapper } from "@/components/KeyboardMapper";
import { PianoVisualizer } from "@/components/PianoVisualizer";
import {
  LessonsPanel,
  getInitialLessonsOpen,
  setLessonsOpenPersisted,
} from "@/components/LessonsPanel";
import { fetchExercises } from "@/lib/exercises";
import type { LessonExercise } from "@/lib/supabase";

export default function Home() {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [exercises, setExercises] = useState<LessonExercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<LessonExercise | null>(null);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [lastKeyCorrect, setLastKeyCorrect] = useState<boolean | null>(null);
  const [lessonsOpen, setLessonsOpen] = useState(true);

  useEffect(() => {
    setLessonsOpen(getInitialLessonsOpen());
  }, []);

  const handleActiveKeysChange = useCallback((keys: Set<string>) => {
    setActiveKeys(keys);
  }, []);

  const handleLessonsOpenChange = useCallback((open: boolean) => {
    setLessonsOpen(open);
    setLessonsOpenPersisted(open);
  }, []);

  useEffect(() => {
    fetchExercises()
      .then(setExercises)
      .catch(() => setExercises([]));
  }, []);

  const handleLessonKeyDown = useCallback(
    (key: string) => {
      if (!lessonsOpen || !selectedExercise || selectedExercise.sequence.length === 0) return;

      const expected = selectedExercise.sequence[lessonIndex]?.toLowerCase();
      if (expected === undefined) return;

      if (key.toLowerCase() === expected) {
        setLessonIndex((i) => i + 1);
        setLastKeyCorrect(true);
      } else {
        setLastKeyCorrect(false);
      }
    },
    [lessonsOpen, selectedExercise, lessonIndex]
  );

  const handleKeyDown = useCallback(
    (key: string) => {
      handleLessonKeyDown(key);
    },
    [handleLessonKeyDown]
  );

  const resetLesson = useCallback(() => {
    setLessonIndex(0);
    setLastKeyCorrect(null);
  }, []);

  const selectExercise = useCallback((ex: LessonExercise) => {
    setSelectedExercise(ex);
    setLessonIndex(0);
    setLastKeyCorrect(null);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center py-8 px-4 sm:px-6">
      <KeyboardMapper
        onKeyDown={handleKeyDown}
        onActiveKeysChange={handleActiveKeysChange}
        activeKeys={activeKeys}
      />

      <header className="text-center mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-piano-white mb-2 tracking-tight">
          SixOne Piano Lab
        </h1>
        <p className="text-sm text-zinc-400 max-w-lg mx-auto">
          Aprende piano con tu teclado. Filas <strong className="text-piano-left">Z–M</strong> (mano izquierda) y{" "}
          <strong className="text-piano-right">Q–I</strong> (mano derecha). Audio al pulsar la primera tecla.
        </p>
      </header>

      <LessonsPanel
        isOpen={lessonsOpen}
        onOpenChange={handleLessonsOpenChange}
        exercises={exercises}
        selectedExercise={selectedExercise}
        onSelectExercise={selectExercise}
        lessonIndex={lessonIndex}
        lastKeyCorrect={lastKeyCorrect}
        onReset={resetLesson}
      />

      <PianoVisualizer activeKeys={activeKeys} />

      <p className="mt-8 text-xs text-zinc-500 max-w-md text-center">
        Teclados 60%: filas ZXCV (octava baja) y QWERTY (octava alta). Polifonía: mantén varias teclas para acordes.
      </p>
    </main>
  );
}
