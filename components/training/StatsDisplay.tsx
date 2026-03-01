'use client';

import { Flame } from 'lucide-react';
import type { SessionState } from '@/hooks/useTrainingSession';

interface StatsDisplayProps {
  session: SessionState;
  totalAccuracy?: number;
}

export default function StatsDisplay({ session, totalAccuracy }: StatsDisplayProps) {
  const accuracy = session.questionCount > 0
    ? Math.round((session.correctCount / session.questionCount) * 100)
    : 0;

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm">
      <div className="flex items-center gap-1.5">
        <span className="text-zinc-500">本轮：</span>
        <span className="font-semibold">{session.correctCount}/{session.questionCount}</span>
        {session.questionCount > 0 && (
          <span className={`font-medium ${accuracy >= 70 ? 'text-green-600' : 'text-orange-600'}`}>
            ({accuracy}%)
          </span>
        )}
      </div>
      {session.streak > 0 && (
        <div className="flex items-center gap-1.5">
          <Flame className="h-4 w-4 text-orange-500" />
          <span className="font-semibold text-orange-600">连续 {session.streak} 题</span>
        </div>
      )}
      {totalAccuracy !== undefined && totalAccuracy > 0 && (
        <div className="flex items-center gap-1.5">
          <span className="text-zinc-500">总正确率：</span>
          <span className="font-semibold">{totalAccuracy}%</span>
        </div>
      )}
    </div>
  );
}
