/**
 * Sintetizador de piano usando Tone.js.
 * Soporta polifonia (multiples notas simultaneas).
 * Uso exclusivo en cliente (dynamic import).
 */

import * as Tone from "tone";

let pianoSynth: Tone.PolySynth<Tone.Synth> | null = null;

/**
 * Inicializa el sintetizador de piano.
 * Debe llamarse tras una interaccion del usuario (ej: click) por politicas de audio.
 */
export async function initPianoSynth(): Promise<void> {
  if (typeof window === "undefined") return;

  await Tone.start();

  if (!pianoSynth) {
    pianoSynth = new Tone.PolySynth(Tone.Synth, {
      maxPolyphony: 16,
      oscillator: { type: "triangle" },
      envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0.3,
        release: 0.5,
      },
    }).toDestination();
  }
}

/**
 * Reproduce una nota con el piano virtual.
 * @param note - Nombre de la nota en formato Tone.js (ej: "C4", "F#3")
 * @param duration - Duracion en segundos
 */
export function playNote(note: string, duration: number = 0.5): void {
  if (!pianoSynth) return;

  try {
    pianoSynth.triggerAttackRelease(note, duration, Tone.now());
  } catch {
    // Ignorar errores de nota invalida
  }
}

/**
 * Inicia el sustain de una nota (para acordes).
 * Debe llamarse a releaseNote para detenerla.
 */
export function triggerAttack(note: string): void {
  if (!pianoSynth) return;

  try {
    pianoSynth.triggerAttack(note, Tone.now());
  } catch {
    // Ignorar errores
  }
}

/**
 * Detiene el sustain de una nota.
 */
export function triggerRelease(note: string): void {
  if (!pianoSynth) return;

  try {
    pianoSynth.triggerRelease(note, Tone.now());
  } catch {
    // Ignorar errores
  }
}

/**
 * Comprueba si el sintetizador esta listo.
 */
export function isSynthReady(): boolean {
  return pianoSynth !== null;
}
