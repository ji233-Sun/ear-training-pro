'use client';

import { useState, useCallback, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import DifficultySelector from '@/components/training/DifficultySelector';
import OptionButton from '@/components/training/OptionButton';
import ResultFeedback from '@/components/training/ResultFeedback';
import StatsDisplay from '@/components/training/StatsDisplay';
import { useTrainingSession } from '@/hooks/useTrainingSession';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { useStats } from '@/hooks/useStats';
import { generateProgressionQuestion, getProgressionOptions, getProgressionLabel, type ProgressionQuestion } from '@/lib/music/progression';
import type { ProgressionType } from '@/lib/music/theory';

export default function ProgressionPage() {
  const { difficulty, changeDifficulty, session, submitAnswer, nextQuestion } = useTrainingSession('progression');
  const { playing, playProgression, schedulePlay } = useAudioEngine();
  const { getModuleAccuracy } = useStats();
  const [question, setQuestion] = useState<ProgressionQuestion | null>(null);
  const options = getProgressionOptions(difficulty);

  const generateNew = useCallback(() => {
    const q = generateProgressionQuestion(difficulty);
    setQuestion(q);
    nextQuestion();
    schedulePlay(() => {
      playProgression(q.chords.map(c => c.notes));
    });
  }, [difficulty, nextQuestion, playProgression, schedulePlay]);

  useEffect(() => {
    generateNew();
  }, [difficulty]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = (value: string) => {
    if (session.answered || !question) return;
    submitAnswer(value, question.type);
  };

  const handleReplay = () => {
    if (!question || playing) return;
    playProgression(question.chords.map(c => c.notes));
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === ' ') { e.preventDefault(); handleReplay(); }
      else if (e.key >= '1' && e.key <= '9') {
        const i = parseInt(e.key) - 1;
        if (i < options.length && !session.answered) handleAnswer(options[i]);
      }
      else if (e.key === 'Enter' && session.answered) generateNew();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">和声进行识别</h1>
          <p className="text-sm text-zinc-500">听辨常见的和弦进行模式</p>
        </div>
        <DifficultySelector value={difficulty} onChange={changeDifficulty} />
      </div>

      <Card className="mb-4">
        <div className="flex items-center justify-between">
          <StatsDisplay session={session} totalAccuracy={getModuleAccuracy('progression')} />
          <Button onClick={handleReplay} disabled={playing} variant="secondary">
            {playing ? '播放中...' : '重新播放'}
          </Button>
        </div>
      </Card>

      {/* 提示信息 */}
      {question && (
        <Card className="mb-4">
          <p className="text-sm text-zinc-600">
            调性：<span className="font-semibold">{question.key} 大调</span>
            {' · '}
            和弦数量：<span className="font-semibold">{question.chords.length}</span>
          </p>
        </Card>
      )}

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {options.map((opt, i) => (
          <OptionButton
            key={opt}
            label={`${i + 1}. ${opt} (${getProgressionLabel(opt)})`}
            value={opt}
            selected={session.selectedAnswer === opt}
            correct={session.answered ? (opt === question?.type ? true : session.selectedAnswer === opt ? false : null) : null}
            disabled={session.answered}
            onClick={handleAnswer}
          />
        ))}
      </div>

      {session.answered && question && (
        <ResultFeedback
          isCorrect={session.isCorrect!}
          correctAnswer={`${question.type} (${getProgressionLabel(question.type)})`}
          selectedAnswer={`${session.selectedAnswer} (${getProgressionLabel(session.selectedAnswer as ProgressionType)})`}
          onNext={generateNew}
        />
      )}
    </div>
  );
}
