'use client';

import { useState, useCallback, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import DifficultySelector from '@/components/training/DifficultySelector';
import StatsDisplay from '@/components/training/StatsDisplay';
import PianoKeyboard from '@/components/music/PianoKeyboard';
import { useTrainingSession } from '@/hooks/useTrainingSession';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { useStats } from '@/hooks/useStats';
import { randomNoteName, noteNameToMidi, midiToNoteName, randomMidi, noteDisplayName } from '@/lib/music/noteUtils';

import { ArrowUp, ArrowDown } from 'lucide-react';

type PitchMode = 'identify' | 'compare';

interface PitchQuestion {
  mode: PitchMode;
  note1: string;
  midi1: number;
  note2?: string;
  midi2?: number;
}

export default function PitchPage() {
  const { difficulty, changeDifficulty, session, submitAnswer, nextQuestion } = useTrainingSession('pitch');
  const { playing, playNote, schedulePlay } = useAudioEngine();
  const { getModuleAccuracy } = useStats();
  const [mode, setMode] = useState<PitchMode>('identify');
  const [question, setQuestion] = useState<PitchQuestion | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const generateNew = useCallback(() => {
    nextQuestion();
    setShowResult(false);
    if (mode === 'identify') {
      const note = randomNoteName(60, 84);
      const midi = noteNameToMidi(note);
      const q: PitchQuestion = { mode: 'identify', note1: note, midi1: midi };
      setQuestion(q);
      schedulePlay(() => playNote(note));
    } else {
      const midi1 = randomMidi(60, 84);
      let midi2 = randomMidi(60, 84);
      while (midi2 === midi1) midi2 = randomMidi(60, 84);
      const q: PitchQuestion = {
        mode: 'compare',
        note1: midiToNoteName(midi1),
        midi1,
        note2: midiToNoteName(midi2),
        midi2,
      };
      setQuestion(q);
      schedulePlay(() => {
        playNote(midiToNoteName(midi1));
        setTimeout(() => playNote(midiToNoteName(midi2)), 800);
      });
    }
  }, [mode, difficulty, nextQuestion, playNote, schedulePlay]);

  useEffect(() => {
    generateNew();
  }, [mode, difficulty]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleIdentify = (midi: number, name: string) => {
    if (showResult || !question || mode !== 'identify') return;
    playNote(name);
    const correct = midi % 12 === question.midi1 % 12;
    setIsCorrect(correct);
    setShowResult(true);
    submitAnswer(correct ? 'correct' : 'incorrect', 'correct');
  };

  const handleCompare = (answer: 'higher' | 'lower') => {
    if (showResult || !question || mode !== 'compare' || !question.midi2) return;
    const correctAnswer = question.midi2 > question.midi1 ? 'higher' : 'lower';
    const correct = answer === correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    submitAnswer(correct ? 'correct' : 'incorrect', 'correct');
  };

  const handleReplay = () => {
    if (!question || playing) return;
    if (mode === 'identify') {
      playNote(question.note1);
    } else if (question.note2) {
      playNote(question.note1);
      setTimeout(() => playNote(question.note2!), 800);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">音高辨别</h1>
          <p className="text-sm text-zinc-500">训练音高识别和比较能力</p>
        </div>
        <DifficultySelector value={difficulty} onChange={changeDifficulty} />
      </div>

      {/* 模式选择 */}
      <Card className="mb-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-zinc-600">模式：</span>
          <button
            onClick={() => setMode('identify')}
            className={`rounded-lg px-3 py-1.5 text-sm ${mode === 'identify' ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-600'}`}
          >
            音名识别
          </button>
          <button
            onClick={() => setMode('compare')}
            className={`rounded-lg px-3 py-1.5 text-sm ${mode === 'compare' ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-600'}`}
          >
            音高比较
          </button>
        </div>
      </Card>

      <Card className="mb-4">
        <div className="flex items-center justify-between">
          <StatsDisplay session={session} totalAccuracy={getModuleAccuracy('pitch')} />
          <Button onClick={handleReplay} disabled={playing} variant="secondary">
            {playing ? '播放中...' : '重新播放'}
          </Button>
        </div>
      </Card>

      {/* 音高比较模式 */}
      {mode === 'compare' && !showResult && (
        <Card className="mb-4">
          <p className="mb-3 text-center text-zinc-600">第二个音比第一个音：</p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => handleCompare('higher')} size="lg" variant="secondary">
              <ArrowUp className="mr-1 h-5 w-5 inline" /> 更高
            </Button>
            <Button onClick={() => handleCompare('lower')} size="lg" variant="secondary">
              <ArrowDown className="mr-1 h-5 w-5 inline" /> 更低
            </Button>
          </div>
        </Card>
      )}

      {/* 音名识别模式 - 钢琴键盘 */}
      {mode === 'identify' && (
        <Card className="mb-4">
          <p className="mb-3 text-sm text-zinc-600">在键盘上点击你听到的音符：</p>
          <PianoKeyboard
            startNote={60}
            endNote={84}
            onNoteClick={handleIdentify}
          />
        </Card>
      )}

      {/* 结果 */}
      {showResult && question && (
        <Card className={`mb-4 border-2 ${isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-lg font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {isCorrect ? '正确！' : '错误'}
              </p>
              <p className="mt-1 text-sm text-zinc-600">
                {mode === 'identify'
                  ? `正确音符：${noteDisplayName(question.note1)} (${question.note1})`
                  : `第一个音：${question.note1}，第二个音：${question.note2}，第二个音${question.midi2! > question.midi1 ? '更高' : '更低'}`
                }
              </p>
            </div>
            <Button onClick={generateNew}>下一题</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
