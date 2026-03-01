// 音阶生成逻辑

import { SCALE_TYPES, SCALE_DIFFICULTY, type ScaleType } from './theory';
import { midiToNoteName, randomMidi } from './noteUtils';
import type { DifficultyLevel } from '@/lib/constants';

export interface ScaleQuestion {
  root: string;
  rootMidi: number;
  notes: string[];
  midiNotes: number[];
  scaleType: ScaleType;
}

export function generateScaleQuestion(difficulty: DifficultyLevel): ScaleQuestion {
  const available = SCALE_DIFFICULTY[difficulty];
  const scaleType = available[Math.floor(Math.random() * available.length)];
  const scale = SCALE_TYPES[scaleType];

  const rootMidi = randomMidi(48, 72);
  const midiNotes = scale.intervals.map(i => rootMidi + i);
  const notes = midiNotes.map(m => midiToNoteName(m));

  return {
    root: midiToNoteName(rootMidi),
    rootMidi,
    notes,
    midiNotes,
    scaleType,
  };
}

export function getScaleOptions(difficulty: DifficultyLevel): ScaleType[] {
  return [...SCALE_DIFFICULTY[difficulty]];
}

export function getScaleLabel(scaleType: ScaleType): string {
  return SCALE_TYPES[scaleType].name;
}
