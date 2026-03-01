// 播放控制（封装常用播放场景）

import {
  playNote,
  playChord,
  playSequence,
  playInterval,
  playChordProgression,
  playRhythm,
} from './audioEngine';
import type { InstrumentType } from '@/lib/constants';

export interface PlaybackOptions {
  instrument?: InstrumentType;
  bpm?: number;
}

export async function playIntervalExercise(
  note1: string,
  note2: string,
  mode: 'melodic' | 'harmonic',
  options: PlaybackOptions = {},
): Promise<void> {
  return playInterval(note1, note2, mode, options.instrument || 'piano');
}

export async function playChordExercise(
  notes: string[],
  options: PlaybackOptions = {},
): Promise<void> {
  playChord(notes, '2n', options.instrument || 'piano');
  return new Promise(resolve => setTimeout(resolve, 1500));
}

export async function playScaleExercise(
  notes: string[],
  options: PlaybackOptions = {},
): Promise<void> {
  return playSequence(notes, 0.3, options.instrument || 'piano');
}

export async function playMelodyExercise(
  notes: string[],
  options: PlaybackOptions = {},
): Promise<void> {
  const speed = (options.bpm || 120) / 120 * 0.5;
  return playSequence(notes, speed, options.instrument || 'piano');
}

export async function playProgressionExercise(
  chords: string[][],
  options: PlaybackOptions = {},
): Promise<void> {
  return playChordProgression(chords, 1.0, options.instrument || 'piano');
}

export async function playRhythmExercise(
  beats: number[],
  options: PlaybackOptions = {},
): Promise<void> {
  return playRhythm(beats, options.bpm || 120, options.instrument || 'piano');
}

export { playNote };
