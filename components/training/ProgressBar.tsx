'use client';

interface ProgressBarProps {
  value: number;  // 0-100
  className?: string;
  color?: string;
}

export default function ProgressBar({ value, className = '', color }: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value));
  const barColor = color || (clampedValue >= 70 ? 'bg-green-500' : clampedValue >= 40 ? 'bg-yellow-500' : 'bg-red-500');

  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-zinc-200 ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-300 ${barColor}`}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}
