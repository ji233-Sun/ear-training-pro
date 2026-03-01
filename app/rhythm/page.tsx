'use client';

import { useState, useCallback, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import DifficultySelector from '@/components/training/DifficultySelector';
import OptionButton from '@/components/training/OptionButton';
import ResultFeedback from '@/components/training/ResultFeedback';
import StatsDisplay from '@/components/training/StatsDisplay';
import RhythmDisplay from '@/components/music/RhythmDisplay';
import { useTrainingSession } from '@/hooks/useTrainingSession';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { useStats } from '@/hooks/useStats';
import { generateRhythmQuestion, type RhythmQuestion } from '@/lib/music/rhythm';

export default function RhythmPage() {
  const { difficulty, changeDifficulty, session, submitAnswer, nextQuestion } = useTrainingSession('rhythm');
  const { playing, playRhythm, schedulePlay } = useAudioEngine();
  const { getModuleAccuracy } = useStats();
  const [question, setQuestion] = useState<RhythmQuestion | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const generateNew = useCallback(() => {
    const q = generateRhythmQuestion(difficulty);
    setQuestion(q);
    nextQuestion();
    schedulePlay(async () => {
      setIsPlaying(true);
      await playRhythm(q.pattern.beats, q.bpm);
      setIsPlaying(false);
    });
  }, [difficulty, nextQuestion, playRhythm, schedulePlay]);

  useEffect(() => {
    generateNew();
  }, [difficulty]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = (value: string) => {
    if (session.answered || !question) return;
    const correctName = question.pattern.name;
    submitAnswer(value, correctName);
  };

  const handleReplay = async () => {
    if (!question || playing) return;
    setIsPlaying(true);
    await playRhythm(question.pattern.beats, question.bpm);
    setIsPlaying(false);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === ' ') { e.preventDefault(); handleReplay(); }
      else if (e.key >= '1' && e.key <= '4') {
        const i = parseInt(e.key) - 1;
        if (question && i < question.options.length && !session.answered) {
          handleAnswer(question.options[i].name);
        }
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
          <h1 className="text-2xl font-bold text-zinc-900">节奏训练</h1>
          <p className="text-sm text-zinc-500">听辨节奏模式，选择正确的节奏型</p>
        </div>
        <DifficultySelector value={difficulty} onChange={changeDifficulty} />
      </div>

      <Card className="mb-4">
        <div className="flex items-center justify-between">
          <StatsDisplay session={session} totalAccuracy={getModuleAccuracy('rhythm')} />
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-500">BPM: {question?.bpm || 120}</span>
            <Button onClick={handleReplay} disabled={playing} variant="secondary">
              {playing ? '播放中...' : '重新播放'}
            </Button>
          </div>
        </div>
      </Card>

      {/* 节奏可视化（播放时显示） */}
      {question && isPlaying && (
        <Card className="mb-4">
          <div className="flex justify-center">
            <RhythmDisplay pattern={question.pattern} isPlaying={isPlaying} bpm={question.bpm} showLabel={false} />
          </div>
        </Card>
      )}

      {/* 选项 */}
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {question?.options.map((opt, i) => (
          <OptionButton
            key={opt.name}
            label={`${i + 1}. ${opt.display}`}
            value={opt.name}
            selected={session.selectedAnswer === opt.name}
            correct={session.answered ? (opt.name === question.pattern.name ? true : session.selectedAnswer === opt.name ? false : null) : null}
            disabled={session.answered}
            onClick={handleAnswer}
          />
        ))}
      </div>

      {session.answered && question && (
        <ResultFeedback
          isCorrect={session.isCorrect!}
          correctAnswer={`${question.pattern.name} (${question.pattern.display})`}
          selectedAnswer={session.selectedAnswer || ''}
          onNext={generateNew}
        />
      )}
    </div>
  );
}
