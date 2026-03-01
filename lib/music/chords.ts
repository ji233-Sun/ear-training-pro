// 和弦生成逻辑

import { CHORD_TYPES, CHORD_DIFFICULTY, type ChordType } from './theory';
import { midiToNoteName, randomMidi } from './noteUtils';
import type { DifficultyLevel } from '@/lib/constants';

export interface ChordQuestion {
  root: string;
  rootMidi: number;
  notes: string[];
  midiNotes: number[];
  chordType: ChordType;
  inversion: number;  // 0 = 原位, 1 = 第一转位, 2 = 第二转位
}

export function generateChordQuestion(
  difficulty: DifficultyLevel,
  allowInversions: boolean = false,
): ChordQuestion {
  const available = CHORD_DIFFICULTY[difficulty];
  const chordType = available[Math.floor(Math.random() * available.length)];
  const chord = CHORD_TYPES[chordType];

  const rootMidi = randomMidi(48, 72);
  let intervals = [...chord.intervals];

  // 转位
  let inversion = 0;
  if (allowInversions && difficulty !== 'beginner') {
    inversion = Math.floor(Math.random() * Math.min(3, intervals.length));
    if (inversion > 0) {
      // 将前 inversion 个音升高一个八度
      for (let i = 0; i < inversion; i++) {
        intervals[i] += 12;
      }
      // 重新排序
      intervals.sort((a, b) => a - b);
    }
  }

  const midiNotes = intervals.map(i => rootMidi + i);
  const notes = midiNotes.map(m => midiToNoteName(m));

  return {
    root: midiToNoteName(rootMidi),
    rootMidi,
    notes,
    midiNotes,
    chordType,
    inversion,
  };
}

export function getChordOptions(difficulty: DifficultyLevel): ChordType[] {
  return [...CHORD_DIFFICULTY[difficulty]];
}

export function getChordLabel(chordType: ChordType): string {
  return CHORD_TYPES[chordType].label;
}
