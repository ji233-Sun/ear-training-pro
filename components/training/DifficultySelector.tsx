'use client';

import { DIFFICULTY_LABELS, DIFFICULTY_LEVELS, type DifficultyLevel } from '@/lib/constants';

interface DifficultySelectorProps {
  value: DifficultyLevel;
  onChange: (level: DifficultyLevel) => void;
}

export default function DifficultySelector({ value, onChange }: DifficultySelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-zinc-600">难度：</span>
      <div className="flex gap-1">
        {DIFFICULTY_LEVELS.map(level => (
          <button
            key={level}
            onClick={() => onChange(level)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              value === level
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            {DIFFICULTY_LABELS[level]}
          </button>
        ))}
      </div>
    </div>
  );
}
