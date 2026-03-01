// 和声进行逻辑

import { PROGRESSION_TYPES, PROGRESSION_DIFFICULTY, type ProgressionType } from './theory';
import { midiToNoteName, randomMidi } from './noteUtils';
import type { DifficultyLevel } from '@/lib/constants';

// 大调各级和弦的类型（大三/小三/减三）
const MAJOR_CHORD_QUALITIES = [
  [0, 4, 7],   // I  - 大三
  [0, 3, 7],   // ii - 小三
  [0, 3, 7],   // iii - 小三
  [0, 4, 7],   // IV - 大三
  [0, 4, 7],   // V  - 大三
  [0, 3, 7],   // vi - 小三
  [0, 3, 6],   // vii° - 减三
];

// 大调各级根音（相对于根音的半音数）
const MAJOR_SCALE_DEGREES = [0, 2, 4, 5, 7, 9, 11];

export interface ProgressionQuestion {
  type: ProgressionType;
  key: string;
  keyMidi: number;
  chords: { notes: string[]; midiNotes: number[]; degree: number }[];
}

export function generateProgressionQuestion(difficulty: DifficultyLevel): ProgressionQuestion {
  const available = PROGRESSION_DIFFICULTY[difficulty];
  const type = available[Math.floor(Math.random() * available.length)];
  const progression = PROGRESSION_TYPES[type];

  const keyMidi = randomMidi(48, 64);
  const key = midiToNoteName(keyMidi);

  const chords = progression.degrees.map(degree => {
    const rootOffset = MAJOR_SCALE_DEGREES[degree];
    const quality = MAJOR_CHORD_QUALITIES[degree];
    const midiNotes = quality.map(interval => keyMidi + rootOffset + interval);
    const notes = midiNotes.map(m => midiToNoteName(m));
    return { notes, midiNotes, degree };
  });

  return { type, key, keyMidi, chords };
}

export function getProgressionOptions(difficulty: DifficultyLevel): ProgressionType[] {
  return [...PROGRESSION_DIFFICULTY[difficulty]];
}

export function getProgressionLabel(type: ProgressionType): string {
  return PROGRESSION_TYPES[type].label;
}
