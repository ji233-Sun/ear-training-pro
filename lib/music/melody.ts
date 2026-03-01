// 旋律生成逻辑

import { midiToNoteName, randomMidi } from './noteUtils';
import type { DifficultyLevel } from '@/lib/constants';

export interface MelodyQuestion {
  notes: string[];
  midiNotes: number[];
  key: string;
  timeSignature: string;
}

/** 生成随机旋律片段 */
export function generateMelody(difficulty: DifficultyLevel): MelodyQuestion {
  const lengths: Record<DifficultyLevel, number> = {
    beginner: 4,
    intermediate: 6,
    advanced: 8,
  };

  const length = lengths[difficulty];
  const rootMidi = randomMidi(60, 72); // C4-C5 范围
  const key = midiToNoteName(rootMidi);

  // 大调音阶级进
  const scaleSteps = [0, 2, 4, 5, 7, 9, 11, 12];
  const midiNotes: number[] = [];

  // 起始音为根音
  let currentStep = 0;
  midiNotes.push(rootMidi + scaleSteps[currentStep]);

  for (let i = 1; i < length; i++) {
    // 倾向于级进运动（步进1-2）
    const maxJump = difficulty === 'beginner' ? 2 : difficulty === 'intermediate' ? 3 : 4;
    const jump = Math.floor(Math.random() * (maxJump * 2 + 1)) - maxJump;
    currentStep = Math.max(0, Math.min(scaleSteps.length - 1, currentStep + jump));
    midiNotes.push(rootMidi + scaleSteps[currentStep]);
  }

  const notes = midiNotes.map(m => midiToNoteName(m));

  return {
    notes,
    midiNotes,
    key,
    timeSignature: '4/4',
  };
}

/** 比较用户输入和正确答案 */
export function compareMelody(
  userMidi: number[],
  correctMidi: number[],
): { score: number; correct: boolean[]; total: number } {
  const total = correctMidi.length;
  const correct = correctMidi.map((midi, i) =>
    i < userMidi.length && userMidi[i] % 12 === midi % 12
  );
  const score = correct.filter(Boolean).length;
  return { score, correct, total };
}
