"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { KeyboardMapper } from "@/components/KeyboardMapper";
import { PianoVisualizer } from "@/components/PianoVisualizer";
import {
  LessonsPanel,
  getInitialLessonsOpen,
  setLessonsOpenPersisted,
} from "@/components/LessonsPanel";
import { fetchExercises } from "@/lib/exercises";
import { mergeExercises, isChordStep, parseStep } from "@/lib/chordExercises";
import type { LessonExercise } from "@/lib/supabase";

export default function Home() {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [exercises, setExercises] = useState<LessonExercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<LessonExercise | null>(null);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [lastKeyCorrect, setLastKeyCorrect] = useState<boolean | null>(null);
  const [lessonsOpen, setLessonsOpen] = useState(true);
  const chordAdvancedRef = useRef(false);

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
      .then((remote) => setExercises(mergeExercises(remote)))
      .catch(() => setExercises(mergeExercises([])));
  }, []);

  /** Avance cuando el paso actual es un acorde y están todas las teclas pulsadas. */
  useEffect(() => {
    if (!selectedExercise || lessonIndex >= selectedExercise.sequence.length) return;
    const step = selectedExercise.sequence[lessonIndex];
    if (!step || !isChordStep(step)) return;

    const expected = parseStep(step);
    const hasAll = expected.length > 0 && expected.every((k) => activeKeys.has(k));
    if (hasAll && !chordAdvancedRef.current) {
      chordAdvancedRef.current = true;
      setLessonIndex((i) => i + 1);
      setLastKeyCorrect(true);
    }
  }, [selectedExercise, lessonIndex, activeKeys]);

  const handleLessonKeyDown = useCallback(
    (key: string) => {
      if (!lessonsOpen || !selectedExercise || selectedExercise.sequence.length === 0) return;

      const step = selectedExercise.sequence[lessonIndex];
      if (step === undefined) return;

      if (isChordStep(step)) return;

      const expected = step.toLowerCase();
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
    chordAdvancedRef.current = false;
  }, []);

  const selectExercise = useCallback((ex: LessonExercise) => {
    setSelectedExercise(ex);
    setLessonIndex(0);
    setLastKeyCorrect(null);
    chordAdvancedRef.current = false;
  }, []);

  /** Al cambiar de paso (acorde → siguiente), permitir de nuevo el avance por acorde. */
  useEffect(() => {
    chordAdvancedRef.current = false;
  }, [lessonIndex]);

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
          Una octava: <strong className="text-piano-left">A–K</strong> = Do Re Mi Fa Sol La Si Do (blancas).{" "}
          <strong className="text-piano-right">Q–T</strong> = negras (Do#, Re#, Fa#, Sol#, La#). Aprende acordes y ubicación.
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
        activeKeys={activeKeys}
      />

      <PianoVisualizer activeKeys={activeKeys} />

      <p className="mt-8 text-xs text-zinc-500 max-w-md text-center">
        Teclado: fila <strong>A–K</strong> (blancas), fila <strong>Q–T</strong> (negras). Mantén varias teclas para acordes.
      </p>
    </main>
  );
}
