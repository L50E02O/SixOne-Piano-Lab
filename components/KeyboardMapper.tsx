"use client";

import { useEffect, useRef, useCallback } from "react";
import { KEY_TO_NOTE, PIANO_KEYS, getNoteForKey } from "@/lib/keyMap";
import { initPianoSynth, triggerAttack, triggerRelease } from "@/lib/tone-synth";

export type KeyboardMapperProps = {
  onKeyDown?: (key: string, note: string) => void;
  onKeyUp?: (key: string, note: string) => void;
  activeKeys?: Set<string>;
  onActiveKeysChange?: (keys: Set<string>) => void;
};

/**
 * Gestiona los eventos keydown/keyup del teclado de la PC.
 * Evita ghosting y repeticion de tecla mediante Set() de teclas activas.
 * Soporta polifonia (acordes).
 */
export function KeyboardMapper({
  onKeyDown,
  onKeyUp,
  activeKeys,
  onActiveKeysChange,
}: KeyboardMapperProps): null {
  const pressedKeysRef = useRef<Set<string>>(new Set());
  const initializedRef = useRef(false);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.repeat) return;

      const key = event.key.toLowerCase();

      if (!PIANO_KEYS.has(key)) return;

      event.preventDefault();

      if (pressedKeysRef.current.has(key)) return;
      pressedKeysRef.current.add(key);

      const noteInfo = getNoteForKey(key);
      if (!noteInfo) return;

      if (!initializedRef.current) {
        initPianoSynth().then(() => {
          initializedRef.current = true;
          triggerAttack(noteInfo.note);
        });
      } else {
        triggerAttack(noteInfo.note);
      }

      onKeyDown?.(key, noteInfo.note);
      onActiveKeysChange?.(new Set(pressedKeysRef.current));
    },
    [onKeyDown, onActiveKeysChange]
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (!PIANO_KEYS.has(key)) return;

      event.preventDefault();

      if (!pressedKeysRef.current.has(key)) return;
      pressedKeysRef.current.delete(key);

      const noteInfo = getNoteForKey(key);
      if (noteInfo) {
        triggerRelease(noteInfo.note);
        onKeyUp?.(key, noteInfo.note);
      }

      onActiveKeysChange?.(new Set(pressedKeysRef.current));
    },
    [onKeyUp, onActiveKeysChange]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return null;
}
