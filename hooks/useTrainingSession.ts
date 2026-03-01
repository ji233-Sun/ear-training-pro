// 训练会话管理 Hook
'use client';

import { useState, useCallback, useEffect } from 'react';
import { updateModuleStats, getModuleStats, getModuleDifficulty, setModuleDifficulty } from '@/lib/store';
import type { ModuleKey, DifficultyLevel } from '@/lib/constants';

export interface SessionState {
  questionCount: number;
  correctCount: number;
  streak: number;
  answered: boolean;
  isCorrect: boolean | null;
  selectedAnswer: string | null;
}

export function useTrainingSession(module: ModuleKey) {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('beginner');
  const [session, setSession] = useState<SessionState>({
    questionCount: 0,
    correctCount: 0,
    streak: 0,
    answered: false,
    isCorrect: null,
    selectedAnswer: null,
  });

  useEffect(() => {
    setDifficulty(getModuleDifficulty(module));
  }, [module]);

  const changeDifficulty = useCallback((level: DifficultyLevel) => {
    setDifficulty(level);
    setModuleDifficulty(module, level);
    setSession({
      questionCount: 0,
      correctCount: 0,
      streak: 0,
      answered: false,
      isCorrect: null,
      selectedAnswer: null,
    });
  }, [module]);

  const submitAnswer = useCallback((selected: string, correct: string) => {
    const isCorrect = selected === correct;
    updateModuleStats(module, isCorrect);

    setSession(prev => ({
      questionCount: prev.questionCount + 1,
      correctCount: prev.correctCount + (isCorrect ? 1 : 0),
      streak: isCorrect ? prev.streak + 1 : 0,
      answered: true,
      isCorrect,
      selectedAnswer: selected,
    }));

    return isCorrect;
  }, [module]);

  const nextQuestion = useCallback(() => {
    setSession(prev => ({
      ...prev,
      answered: false,
      isCorrect: null,
      selectedAnswer: null,
    }));
  }, []);

  const resetSession = useCallback(() => {
    setSession({
      questionCount: 0,
      correctCount: 0,
      streak: 0,
      answered: false,
      isCorrect: null,
      selectedAnswer: null,
    });
  }, []);

  const stats = typeof window !== 'undefined' ? getModuleStats(module) : null;

  return {
    difficulty,
    changeDifficulty,
    session,
    submitAnswer,
    nextQuestion,
    resetSession,
    stats,
  };
}
