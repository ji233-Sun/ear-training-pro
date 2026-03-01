'use client';

import { useState, useCallback, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import DifficultySelector from '@/components/training/DifficultySelector';
import StatsDisplay from '@/components/training/StatsDisplay';
import PianoKeyboard from '@/components/music/PianoKeyboard';
import StaffRenderer from '@/components/music/StaffRenderer';
import { useTrainingSession } from '@/hooks/useTrainingSession';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { useStats } from '@/hooks/useStats';
import { generateMelody, compareMelody, type MelodyQuestion } from '@/lib/music/melody';
import { noteToVexFlow, noteNameToMidi, midiToNoteName } from '@/lib/music/noteUtils';

export default function DictationPage() {
  const { difficulty, changeDifficulty, session, submitAnswer, nextQuestion } = useTrainingSession('dictation');
  const { playing, playMelody, playNote, schedulePlay } = useAudioEngine();
  const { getModuleAccuracy } = useStats();
  const [question, setQuestion] = useState<MelodyQuestion | null>(null);
  const [userNotes, setUserNotes] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{ score: number; correct: boolean[]; total: number } | null>(null);

  const generateNew = useCallback(() => {
    const q = generateMelody(difficulty);
    setQuestion(q);
    setUserNotes([]);
    setShowResult(false);
    setResult(null);
    nextQuestion();
    schedulePlay(() => {
      playMelody(q.notes);
    });
  }, [difficulty, nextQuestion, playMelody, schedulePlay]);

  useEffect(() => {
    generateNew();
  }, [difficulty]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNoteClick = (midi: number, name: string) => {
    if (showResult || !question) return;
    playNote(name);
    const newNotes = [...userNotes, midi];
    setUserNotes(newNotes);
  };

  const handleUndo = () => {
    setUserNotes(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (!question || userNotes.length === 0) return;
    const res = compareMelody(userNotes, question.midiNotes);
    setResult(res);
    setShowResult(true);
    const isCorrect = res.score === res.total;
    submitAnswer(isCorrect ? 'correct' : 'incorrect', 'correct');
  };

  const handleReplay = () => {
    if (!question || playing) return;
    playMelody(question.notes);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">旋律听写</h1>
          <p className="text-sm text-zinc-500">听旋律，在键盘上输入听到的音符</p>
        </div>
        <DifficultySelector value={difficulty} onChange={changeDifficulty} />
      </div>

      <Card className="mb-4">
        <div className="flex items-center justify-between">
          <StatsDisplay session={session} totalAccuracy={getModuleAccuracy('dictation')} />
          <div className="flex gap-2">
            <Button onClick={handleReplay} disabled={playing} variant="secondary">
              {playing ? '播放中...' : '重新播放'}
            </Button>
          </div>
        </div>
      </Card>

      {/* 五线谱显示 */}
      <Card className="mb-4">
        <h3 className="mb-2 text-sm font-medium text-zinc-600">
          {showResult ? '正确答案' : '你的输入'}
          {question && ` (共 ${question.midiNotes.length} 个音符)`}
        </h3>
        <div className="flex justify-center">
          <StaffRenderer
            notes={
              showResult && question
                ? question.notes.map(n => noteToVexFlow(n))
                : userNotes.map(m => noteToVexFlow(midiToNoteName(m)))
            }
            width={Math.min(600, typeof window !== 'undefined' ? window.innerWidth - 80 : 600)}
          />
        </div>
        {showResult && result && (
          <div className="mt-3 text-center">
            <p className={`text-lg font-semibold ${result.score === result.total ? 'text-green-600' : 'text-orange-600'}`}>
              得分：{result.score}/{result.total}
            </p>
            <div className="mt-1 flex justify-center gap-1">
              {result.correct.map((c, i) => (
                <span key={i} className={`inline-block h-3 w-3 rounded-full ${c ? 'bg-green-500' : 'bg-red-500'}`} />
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* 用户输入状态 */}
      {!showResult && (
        <Card className="mb-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-600">
              已输入：{userNotes.length}{question ? `/${question.midiNotes.length}` : ''} 个音符
              {userNotes.length > 0 && (
                <span className="ml-2 text-zinc-400">
                  {userNotes.map(m => midiToNoteName(m)).join(' → ')}
                </span>
              )}
            </p>
            <div className="flex gap-2">
              <Button onClick={handleUndo} variant="ghost" size="sm" disabled={userNotes.length === 0}>
                撤销
              </Button>
              <Button onClick={handleSubmit} size="sm" disabled={userNotes.length === 0}>
                提交答案
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* 钢琴键盘 */}
      <Card className="mb-4">
        <PianoKeyboard
          startNote={48}
          endNote={84}
          activeNotes={userNotes}
          onNoteClick={handleNoteClick}
        />
      </Card>

      {showResult && (
        <div className="flex justify-center">
          <Button onClick={generateNew}>下一题</Button>
        </div>
      )}
    </div>
  );
}
