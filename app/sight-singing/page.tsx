'use client';

import { useState, useCallback, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import DifficultySelector from '@/components/training/DifficultySelector';
import StatsDisplay from '@/components/training/StatsDisplay';
import StaffRenderer from '@/components/music/StaffRenderer';
import { useTrainingSession } from '@/hooks/useTrainingSession';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { useStats } from '@/hooks/useStats';
import { generateMelody, type MelodyQuestion } from '@/lib/music/melody';
import { noteToVexFlow } from '@/lib/music/noteUtils';
import { Check, X } from 'lucide-react';

export default function SightSingingPage() {
  const { difficulty, changeDifficulty, session, nextQuestion, submitAnswer } = useTrainingSession('sight-singing');
  const { playing, playMelody } = useAudioEngine();
  const { getModuleAccuracy } = useStats();
  const [question, setQuestion] = useState<MelodyQuestion | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selfEval, setSelfEval] = useState<boolean | null>(null);

  const generateNew = useCallback(() => {
    const q = generateMelody(difficulty);
    setQuestion(q);
    setShowAnswer(false);
    setSelfEval(null);
    nextQuestion();
  }, [difficulty, nextQuestion]);

  useEffect(() => {
    generateNew();
  }, [difficulty]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePlayAnswer = async () => {
    if (!question || playing) return;
    setShowAnswer(true);
    await playMelody(question.notes);
  };

  const handleSelfEval = (correct: boolean) => {
    setSelfEval(correct);
    submitAnswer(correct ? 'correct' : 'incorrect', 'correct');
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">视唱练习</h1>
          <p className="text-sm text-zinc-500">看谱唱旋律，然后播放检验</p>
        </div>
        <DifficultySelector value={difficulty} onChange={changeDifficulty} />
      </div>

      <Card className="mb-4">
        <StatsDisplay session={session} totalAccuracy={getModuleAccuracy('sight-singing')} />
      </Card>

      {/* 乐谱显示 */}
      {question && (
        <Card className="mb-4">
          <h3 className="mb-3 text-sm font-medium text-zinc-600">
            请看谱视唱以下旋律：
          </h3>
          <div className="flex justify-center">
            <StaffRenderer
              notes={question.notes.map(n => noteToVexFlow(n))}
              timeSignature={question.timeSignature}
              width={Math.min(700, typeof window !== 'undefined' ? window.innerWidth - 80 : 700)}
              height={180}
            />
          </div>
        </Card>
      )}

      {/* 操作区域 */}
      <Card className="mb-4">
        <div className="flex flex-col items-center gap-4">
          {!showAnswer && (
            <>
              <p className="text-center text-zinc-600">
                先尝试根据乐谱唱出旋律，然后点击下方按钮听正确答案
              </p>
              <Button onClick={handlePlayAnswer} disabled={playing} size="lg">
                {playing ? '播放中...' : '播放正确旋律'}
              </Button>
            </>
          )}

          {showAnswer && selfEval === null && (
            <>
              <p className="text-center text-zinc-600">
                你唱对了吗？
              </p>
              <div className="flex gap-4">
                <Button onClick={() => handleSelfEval(true)} variant="primary" size="lg">
                  <Check className="mr-1 h-5 w-5 inline" /> 唱对了
                </Button>
                <Button onClick={() => handleSelfEval(false)} variant="danger" size="lg">
                  <X className="mr-1 h-5 w-5 inline" /> 没唱对
                </Button>
              </div>
              <Button onClick={handlePlayAnswer} disabled={playing} variant="ghost" size="sm">
                再听一次
              </Button>
            </>
          )}

          {selfEval !== null && (
            <div className="text-center">
              <p className={`text-lg font-semibold ${selfEval ? 'text-green-600' : 'text-orange-600'}`}>
                {selfEval ? '很棒！继续保持！' : '没关系，多练习就会进步！'}
              </p>
              <Button onClick={generateNew} className="mt-3">
                下一题
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
