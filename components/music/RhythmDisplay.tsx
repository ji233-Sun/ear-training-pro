'use client';

import { useEffect, useState, useRef } from 'react';
import type { RhythmPattern } from '@/lib/music/theory';

interface RhythmDisplayProps {
  pattern: RhythmPattern;
  isPlaying?: boolean;
  bpm?: number;
  showLabel?: boolean;
}

export default function RhythmDisplay({ pattern, isPlaying = false, bpm = 120, showLabel = true }: RhythmDisplayProps) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      setActiveIndex(-1);
      return;
    }

    const beatDuration = 60000 / bpm; // ms per beat
    let index = 0;
    let elapsed = 0;

    function scheduleNext() {
      if (index >= pattern.beats.length) {
        setActiveIndex(-1);
        return;
      }
      setActiveIndex(index);
      const duration = pattern.beats[index] * beatDuration;
      timerRef.current = setTimeout(() => {
        index++;
        elapsed += duration;
        scheduleNext();
      }, duration);
    }

    scheduleNext();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, pattern, bpm]);

  return (
    <div className="flex flex-col items-center gap-2">
      {showLabel && (
        <p className="text-sm font-medium text-zinc-500">{pattern.name}</p>
      )}
      <div className="flex items-end gap-1">
        {pattern.beats.map((beat, i) => {
          const height = Math.max(24, beat * 40);
          const isActive = i === activeIndex;
          return (
            <div
              key={i}
              className={`flex items-center justify-center rounded transition-all ${
                isActive
                  ? 'bg-blue-500 text-white'
                  : 'bg-zinc-200 text-zinc-600'
              }`}
              style={{ width: Math.max(32, beat * 48), height }}
            >
              <span className="text-xs font-mono">{beat >= 1 ? beat : `1/${Math.round(1/beat)}`}</span>
            </div>
          );
        })}
      </div>
      <p className="text-lg tracking-widest">{pattern.display}</p>
    </div>
  );
}
