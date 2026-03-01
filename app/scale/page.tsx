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
import { generateScaleQuestion, getScaleOptions, getScaleLabel, type ScaleQuestion } from '@/lib/music/scales';
import type { ScaleType } from '@/lib/music/theory';

export default function ScalePage() {
  const { difficulty, changeDifficulty, session, submitAnswer, nextQuestion } = useTrainingSession('scale');
  const { playing, playScale, schedulePlay } = useAudioEngine();
  const { getModuleAccuracy } = useStats();
  const [question, setQuestion] = useState<ScaleQuestion | null>(null);
  const options = getScaleOptions(difficulty);

  const generateNew = useCallback(() => {
    const q = generateScaleQuestion(difficulty);
    setQuestion(q);
    nextQuestion();
    schedulePlay(() => {
      playScale(q.notes);
    });
  }, [difficulty, nextQuestion, playScale, schedulePlay]);

  useEffect(() => {
    generateNew();
  }, [difficulty]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = (value: string) => {
    if (session.answered || !question) return;
    submitAnswer(value, question.scaleType);
  };

  const handleReplay = () => {
    if (!question || playing) return;
    playScale(question.notes);
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
          <h1 className="text-2xl font-bold text-zinc-900">音阶/调式识别</h1>
          <p className="text-sm text-zinc-500">听辨音阶和调式类型</p>
        </div>
        <DifficultySelector value={difficulty} onChange={changeDifficulty} />
      </div>

      <Card className="mb-4">
        <div className="flex items-center justify-between">
          <StatsDisplay session={session} totalAccuracy={getModuleAccuracy('scale')} />
          <Button onClick={handleReplay} disabled={playing} variant="secondary">
            {playing ? '播放中...' : '重新播放'}
          </Button>
        </div>
      </Card>

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {options.map((opt, i) => (
          <OptionButton
            key={opt}
            label={`${i + 1}. ${getScaleLabel(opt)}`}
            value={opt}
            selected={session.selectedAnswer === opt}
            correct={session.answered ? (opt === question?.scaleType ? true : session.selectedAnswer === opt ? false : null) : null}
            disabled={session.answered}
            onClick={handleAnswer}
          />
        ))}
      </div>

      {session.answered && question && (
        <ResultFeedback
          isCorrect={session.isCorrect!}
          correctAnswer={getScaleLabel(question.scaleType)}
          selectedAnswer={getScaleLabel(session.selectedAnswer as ScaleType) || session.selectedAnswer || ''}
          onNext={generateNew}
        />
      )}
    </div>
  );
}
