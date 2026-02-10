"use client";

import { KEY_TO_NOTE, NOTE_ORDER, getHandForKey } from "@/lib/keyMap";

export type PianoVisualizerProps = {
  activeKeys?: Set<string>;
};

/** Piano de una octava: blancas A–K, negras Q–T. Muestra solfeo (Do Re Mi) y tecla. */
export function PianoVisualizer({ activeKeys = new Set() }: PianoVisualizerProps) {
  return (
    <div className="w-full max-w-4xl mx-auto select-none">
      <div className="flex items-center justify-center gap-1 mb-2 px-1">
        <span className="text-[10px] font-medium text-piano-left/80">Blancas A–K</span>
        <span className="text-[10px] text-zinc-500">|</span>
        <span className="text-[10px] font-medium text-piano-right/80">Negras Q–T</span>
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
                {info.solfeo}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
