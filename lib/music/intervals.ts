// 音程生成逻辑

import { INTERVAL_SEMITONES, INTERVAL_DIFFICULTY, type IntervalName } from './theory';
import { midiToNoteName, randomMidi } from './noteUtils';
import type { DifficultyLevel } from '@/lib/constants';

export interface IntervalQuestion {
  root: string;        // 根音音名
  rootMidi: number;
  target: string;      // 目标音音名
  targetMidi: number;
  interval: IntervalName;
  direction: 'ascending' | 'descending';
  mode: 'melodic' | 'harmonic';
}

export function generateIntervalQuestion(
  difficulty: DifficultyLevel,
  mode: 'melodic' | 'harmonic' = 'melodic',
  direction: 'ascending' | 'descending' = 'ascending',
): IntervalQuestion {
  const available = INTERVAL_DIFFICULTY[difficulty];
  const interval = available[Math.floor(Math.random() * available.length)];
  const semitones = INTERVAL_SEMITONES[interval];

  // 选择根音（确保目标音不超出范围）
  const minRoot = direction === 'ascending' ? 48 : 48 + semitones;
  const maxRoot = direction === 'ascending' ? 84 - semitones : 84;
  const rootMidi = randomMidi(minRoot, maxRoot);

  const targetMidi = direction === 'ascending'
    ? rootMidi + semitones
    : rootMidi - semitones;

  return {
    root: midiToNoteName(rootMidi),
    rootMidi,
    target: midiToNoteName(targetMidi),
    targetMidi,
    interval,
    direction,
    mode,
  };
}

export function getIntervalOptions(difficulty: DifficultyLevel): IntervalName[] {
  return [...INTERVAL_DIFFICULTY[difficulty]];
}
