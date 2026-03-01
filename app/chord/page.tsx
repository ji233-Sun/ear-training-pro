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
import { generateChordQuestion, getChordOptions, getChordLabel, type ChordQuestion } from '@/lib/music/chords';
import type { ChordType } from '@/lib/music/theory';

export default function ChordPage() {
  const { difficulty, changeDifficulty, session, submitAnswer, nextQuestion } = useTrainingSession('chord');
  const { playing, playChord, schedulePlay } = useAudioEngine();
  const { getModuleAccuracy } = useStats();
  const [question, setQuestion] = useState<ChordQuestion | null>(null);
  const options = getChordOptions(difficulty);

  const generateNew = useCallback(() => {
    const q = generateChordQuestion(difficulty, difficulty !== 'beginner');
    setQuestion(q);
    nextQuestion();
    schedulePlay(() => {
      playChord(q.notes);
    });
  }, [difficulty, nextQuestion, playChord, schedulePlay]);

  useEffect(() => {
    generateNew();
  }, [difficulty]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = (value: string) => {
    if (session.answered || !question) return;
    submitAnswer(value, question.chordType);
  };

  const handleReplay = () => {
    if (!question || playing) return;
    playChord(question.notes);
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
          <h1 className="text-2xl font-bold text-zinc-900">和弦识别</h1>
          <p className="text-sm text-zinc-500">听辨和弦类型（三和弦、七和弦）</p>
        </div>
        <DifficultySelector value={difficulty} onChange={changeDifficulty} />
      </div>

      <Card className="mb-4">
        <div className="flex items-center justify-between">
          <StatsDisplay session={session} totalAccuracy={getModuleAccuracy('chord')} />
          <Button onClick={handleReplay} disabled={playing} variant="secondary">
            {playing ? '播放中...' : '重新播放'}
          </Button>
        </div>
      </Card>

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {options.map((opt, i) => (
          <OptionButton
            key={opt}
            label={`${i + 1}. ${getChordLabel(opt)}`}
            value={opt}
            selected={session.selectedAnswer === opt}
            correct={session.answered ? (opt === question?.chordType ? true : session.selectedAnswer === opt ? false : null) : null}
            disabled={session.answered}
            onClick={handleAnswer}
          />
        ))}
      </div>

      {session.answered && question && (
        <ResultFeedback
          isCorrect={session.isCorrect!}
          correctAnswer={getChordLabel(question.chordType)}
          selectedAnswer={getChordLabel(session.selectedAnswer as ChordType) || session.selectedAnswer || ''}
          onNext={generateNew}
        />
      )}
    </div>
  );
}
