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
import { generateIntervalQuestion, getIntervalOptions, type IntervalQuestion } from '@/lib/music/intervals';
import { INTERVAL_LABELS, type IntervalName } from '@/lib/music/theory';

export default function IntervalPage() {
  const { difficulty, changeDifficulty, session, submitAnswer, nextQuestion } = useTrainingSession('interval');
  const { playing, playInterval, schedulePlay } = useAudioEngine();
  const { getModuleAccuracy } = useStats();
  const [question, setQuestion] = useState<IntervalQuestion | null>(null);
  const [mode, setMode] = useState<'melodic' | 'harmonic'>('melodic');
  const [direction, setDirection] = useState<'ascending' | 'descending'>('ascending');
  const options = getIntervalOptions(difficulty);

  const generateNew = useCallback(() => {
    const q = generateIntervalQuestion(difficulty, mode, direction);
    setQuestion(q);
    nextQuestion();
    // 自动播放
    schedulePlay(() => {
      playInterval(q.root, q.target, mode);
    });
  }, [difficulty, mode, direction, nextQuestion, playInterval, schedulePlay]);

  useEffect(() => {
    generateNew();
  }, [difficulty, mode, direction]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = (value: string) => {
    if (session.answered || !question) return;
    submitAnswer(value, question.interval);
  };

  const handleReplay = () => {
    if (!question || playing) return;
    playInterval(question.root, question.target, mode);
  };

  const handleNext = () => {
    generateNew();
  };

  // 键盘快捷键
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        handleReplay();
      } else if (e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key) - 1;
        if (index < options.length && !session.answered) {
          handleAnswer(options[index]);
        }
      } else if (e.key === 'Enter' && session.answered) {
        handleNext();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">音程识别</h1>
          <p className="text-sm text-zinc-500">听辨两个音之间的音程关系</p>
        </div>
        <DifficultySelector value={difficulty} onChange={changeDifficulty} />
      </div>

      {/* 模式选择 */}
      <Card className="mb-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-zinc-600">类型：</span>
            <button
              onClick={() => setMode('melodic')}
              className={`rounded-lg px-3 py-1.5 text-sm ${mode === 'melodic' ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-600'}`}
            >
              旋律音程
            </button>
            <button
              onClick={() => setMode('harmonic')}
              className={`rounded-lg px-3 py-1.5 text-sm ${mode === 'harmonic' ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-600'}`}
            >
              和声音程
            </button>
          </div>
          {mode === 'melodic' && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-zinc-600">方向：</span>
              <button
                onClick={() => setDirection('ascending')}
                className={`rounded-lg px-3 py-1.5 text-sm ${direction === 'ascending' ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-600'}`}
              >
                上行
              </button>
              <button
                onClick={() => setDirection('descending')}
                className={`rounded-lg px-3 py-1.5 text-sm ${direction === 'descending' ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-600'}`}
              >
                下行
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* 播放控制 */}
      <Card className="mb-4">
        <div className="flex items-center justify-between">
          <StatsDisplay session={session} totalAccuracy={getModuleAccuracy('interval')} />
          <Button onClick={handleReplay} disabled={playing} variant="secondary">
            {playing ? '播放中...' : '重新播放'}
          </Button>
        </div>
      </Card>

      {/* 选项 */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {options.map((opt, i) => (
          <OptionButton
            key={opt}
            label={`${i + 1}. ${INTERVAL_LABELS[opt]}`}
            value={opt}
            selected={session.selectedAnswer === opt}
            correct={session.answered ? (opt === question?.interval ? true : session.selectedAnswer === opt ? false : null) : null}
            disabled={session.answered}
            onClick={handleAnswer}
          />
        ))}
      </div>

      {/* 反馈 */}
      {session.answered && question && (
        <ResultFeedback
          isCorrect={session.isCorrect!}
          correctAnswer={INTERVAL_LABELS[question.interval]}
          selectedAnswer={INTERVAL_LABELS[session.selectedAnswer as IntervalName] || session.selectedAnswer || ''}
          onNext={handleNext}
        />
      )}
    </div>
  );
}
