// 节奏生成逻辑

import { RHYTHM_PATTERNS, type RhythmPattern, type TimeSignature } from './theory';
import type { DifficultyLevel } from '@/lib/constants';

export interface RhythmQuestion {
  pattern: RhythmPattern;
  timeSignature: TimeSignature;
  bpm: number;
  options: RhythmPattern[];
  correctIndex: number;
}

export function generateRhythmQuestion(
  difficulty: DifficultyLevel,
  timeSignature: TimeSignature = '4/4',
  bpm: number = 120,
): RhythmQuestion {
  const diffKey = difficulty === 'beginner' ? 'beginner' : difficulty === 'intermediate' ? 'intermediate' : 'advanced';
  const patterns = RHYTHM_PATTERNS[diffKey];

  const correctIndex = Math.floor(Math.random() * patterns.length);
  const pattern = patterns[correctIndex];

  // 生成选项（包含正确答案 + 3个干扰项）
  const shuffled = [...patterns].sort(() => Math.random() - 0.5);
  let options: RhythmPattern[];
  if (shuffled.length <= 4) {
    options = shuffled;
  } else {
    options = shuffled.slice(0, 4);
    if (!options.includes(pattern)) {
      options[0] = pattern;
      options.sort(() => Math.random() - 0.5);
    }
  }

  const answerIndex = options.indexOf(pattern);

  return {
    pattern,
    timeSignature,
    bpm,
    options,
    correctIndex: answerIndex,
  };
}

export function getRhythmPatterns(difficulty: DifficultyLevel): RhythmPattern[] {
  const diffKey = difficulty === 'beginner' ? 'beginner' : difficulty === 'intermediate' ? 'intermediate' : 'advanced';
  return [...RHYTHM_PATTERNS[diffKey]];
}
