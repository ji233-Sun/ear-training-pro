'use client';

interface OptionButtonProps {
  label: string;
  value: string;
  selected: boolean;
  correct?: boolean | null;  // null = 未判断, true/false = 正误
  disabled?: boolean;
  onClick: (value: string) => void;
}

export default function OptionButton({ label, value, selected, correct, disabled, onClick }: OptionButtonProps) {
  let style = 'border-zinc-200 bg-white text-zinc-700 hover:border-blue-300 hover:bg-blue-50';

  if (selected && correct === null) {
    style = 'border-blue-500 bg-blue-50 text-blue-700';
  } else if (correct === true && selected) {
    style = 'border-green-500 bg-green-50 text-green-700';
  } else if (correct === false && selected) {
    style = 'border-red-500 bg-red-50 text-red-700';
  } else if (correct === true && !selected) {
    // 显示正确答案
    style = 'border-green-400 bg-green-50/50 text-green-600';
  }

  return (
    <button
      onClick={() => onClick(value)}
      disabled={disabled}
      className={`rounded-xl border-2 px-4 py-3 text-center font-medium transition-all disabled:cursor-not-allowed ${style}`}
    >
      {label}
    </button>
  );
}
