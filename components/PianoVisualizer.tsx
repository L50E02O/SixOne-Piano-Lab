"use client";

import { KEY_TO_NOTE, getHandForKey } from "@/lib/keyMap";

export type PianoVisualizerProps = {
  activeKeys?: Set<string>;
};

const NOTE_ORDER = [
  "z", "s", "x", "d", "c", "v", "g", "b", "h", "n", "j", "m",
  "q", "2", "w", "3", "e", "r", "5", "t", "6", "y", "7", "u", "i",
];

/** Visualizador de piano con zonas L/R como en un piano real. */
export function PianoVisualizer({ activeKeys = new Set() }: PianoVisualizerProps) {
  return (
    <div className="w-full max-w-5xl mx-auto select-none">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[10px] font-medium text-piano-left/80">Mano izquierda (Z–M)</span>
        <span className="text-[10px] font-medium text-piano-right/80">Mano derecha (Q–I)</span>
      </div>
      <div className="flex rounded-xl overflow-hidden shadow-piano border border-piano-border bg-piano-black">
        {NOTE_ORDER.map((key) => {
          const info = KEY_TO_NOTE[key];
          if (!info) return null;

          const isActive = activeKeys.has(key);
          const isBlack = info.isBlack;
          const hand = getHandForKey(key);

          return (
            <div
              key={key}
              className={`
                relative flex flex-col items-center justify-end pb-2 flex-1 min-w-0
                transition-colors duration-75
                ${isBlack ? "h-28 -mx-1 z-10 w-6 shrink-0" : "h-52"}
                ${isBlack
                  ? isActive
                    ? "bg-piano-active"
                    : "bg-gray-900"
                  : isActive
                    ? "bg-piano-active"
                    : hand === "L"
                      ? "bg-piano-ivory/95"
                      : "bg-piano-white"}
                ${isBlack ? "rounded-b border border-piano-border" : "border-r border-piano-border"}
              `}
            >
              <span
                className={`
                  text-xs font-mono font-semibold px-1.5 py-0.5 rounded
                  ${isActive ? "text-white" : isBlack ? "text-piano-white" : "text-piano-black"}
                `}
              >
                {info.keyLabel}
              </span>
              <span
                className={`text-[10px] mt-0.5 ${
                  isBlack ? "text-piano-white/70" : "text-piano-black/60"
                }`}
              >
                {info.note}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
