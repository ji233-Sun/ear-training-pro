// 音频引擎 React Hook
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { initAudio, isAudioReady, setVolume, stopAll } from '@/lib/audio/audioEngine';
import {
  playIntervalExercise,
  playChordExercise,
  playScaleExercise,
  playMelodyExercise,
  playProgressionExercise,
  playRhythmExercise,
  playNote,
} from '@/lib/audio/player';
import { getSettings } from '@/lib/store';
import type { InstrumentType } from '@/lib/constants';

export function useAudioEngine() {
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const instrumentRef = useRef<InstrumentType>('piano');
  const mountedRef = useRef(true);
  const playTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    mountedRef.current = true;
    setReady(isAudioReady());
    const settings = getSettings();
    instrumentRef.current = settings.instrument;
    setVolume(settings.volume);

    return () => {
      mountedRef.current = false;
      if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current);
      stopAll();
    };
  }, []);

  const init = useCallback(async () => {
    await initAudio();
    setReady(true);
    const settings = getSettings();
    instrumentRef.current = settings.instrument;
    setVolume(settings.volume);
  }, []);

  /** 延迟播放（自动取消前一次，组件卸载时取消） */
  const schedulePlay = useCallback((fn: () => void | Promise<void>, delay = 300) => {
    if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current);
    playTimeoutRef.current = setTimeout(() => {
      if (mountedRef.current) fn();
    }, delay);
  }, []);

  const withPlayState = useCallback(async (fn: () => Promise<void>) => {
    if (!mountedRef.current) return;
    if (!isAudioReady()) await initAudio();
    if (!mountedRef.current) return;
    setReady(true);
    setPlaying(true);
    try {
      await fn();
    } finally {
      if (mountedRef.current) setPlaying(false);
    }
  }, []);

  const playIntervalFn = useCallback(
    (note1: string, note2: string, mode: 'melodic' | 'harmonic') =>
      withPlayState(() => playIntervalExercise(note1, note2, mode, { instrument: instrumentRef.current })),
    [withPlayState],
  );

  const playChordFn = useCallback(
    (notes: string[]) =>
      withPlayState(() => playChordExercise(notes, { instrument: instrumentRef.current })),
    [withPlayState],
  );

  const playScaleFn = useCallback(
    (notes: string[]) =>
      withPlayState(() => playScaleExercise(notes, { instrument: instrumentRef.current })),
    [withPlayState],
  );

  const playMelodyFn = useCallback(
    (notes: string[]) =>
      withPlayState(() => playMelodyExercise(notes, { instrument: instrumentRef.current })),
    [withPlayState],
  );

  const playProgressionFn = useCallback(
    (chords: string[][]) =>
      withPlayState(() => playProgressionExercise(chords, { instrument: instrumentRef.current })),
    [withPlayState],
  );

  const playRhythmFn = useCallback(
    (beats: number[], bpm?: number) =>
      withPlayState(() => playRhythmExercise(beats, { instrument: instrumentRef.current, bpm })),
    [withPlayState],
  );

  const playNoteFn = useCallback(
    (note: string) => {
      if (!mountedRef.current) return;
      if (!isAudioReady()) {
        initAudio().then(() => {
          if (!mountedRef.current) return;
          setReady(true);
          playNote(note, '8n', instrumentRef.current);
        });
      } else {
        playNote(note, '8n', instrumentRef.current);
      }
    },
    [],
  );

  const setInstrument = useCallback((type: InstrumentType) => {
    instrumentRef.current = type;
  }, []);

  return {
    ready,
    playing,
    init,
    schedulePlay,
    playInterval: playIntervalFn,
    playChord: playChordFn,
    playScale: playScaleFn,
    playMelody: playMelodyFn,
    playProgression: playProgressionFn,
    playRhythm: playRhythmFn,
    playNote: playNoteFn,
    setInstrument,
    setVolume,
    stopAll,
  };
}
