"use client";

import { useState, useCallback, useEffect } from "react";
import { KeyboardMapper } from "@/components/KeyboardMapper";
import { PianoVisualizer } from "@/components/PianoVisualizer";
import {
  LessonsPanel,
  getInitialLessonsOpen,
  setLessonsOpenPersisted,
} from "@/components/LessonsPanel";
import { initPianoSynth } from "@/lib/tone-synth";
import { fetchExercises } from "@/lib/exercises";
import type { LessonExercise } from "@/lib/supabase";

export default function Home() {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [audioUnlocked, setAudioUnlocked] = useState(false);
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

  const handleUnlockAudio = useCallback(async () => {
    await initPianoSynth();
    setAudioUnlocked(true);
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
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <KeyboardMapper
        onKeyDown={handleKeyDown}
        onActiveKeysChange={handleActiveKeysChange}
        activeKeys={activeKeys}
      />

      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold text-piano-white mb-2">
          PC Piano Learner
        </h1>
        <p className="text-sm text-zinc-400 mb-4">
          Usa las teclas QWERTY, numeros (2-7) y ZXCV para tocar.
        </p>
        {!audioUnlocked && (
          <button
            type="button"
            onClick={handleUnlockAudio}
            className="px-4 py-2 rounded-lg bg-piano-active text-white font-medium hover:bg-piano-active/90 transition-colors"
          >
            Activar audio
          </button>
        )}
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

      <p className="mt-6 text-xs text-zinc-500 max-w-md text-center">
        Optimizado para teclados 60%. Filas ZXCV y QWERTY mapean dos octavas.
        Polifonia activa: puedes tocar acordes manteniendo varias teclas.
      </p>
    </main>
  );
}
