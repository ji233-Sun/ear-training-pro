'use client';

interface ResultFeedbackProps {
  isCorrect: boolean;
  correctAnswer: string;
  selectedAnswer: string;
  onNext: () => void;
}

export default function ResultFeedback({ isCorrect, correctAnswer, selectedAnswer, onNext }: ResultFeedbackProps) {
  return (
    <div className={`mt-4 rounded-xl border-2 p-4 ${
      isCorrect
        ? 'border-green-300 bg-green-50'
        : 'border-red-300 bg-red-50'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-lg font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
            {isCorrect ? '正确！' : '错误'}
          </p>
          {!isCorrect && (
            <p className="mt-1 text-sm text-zinc-600">
              正确答案：<span className="font-medium">{correctAnswer}</span>
            </p>
          )}
        </div>
        <button
          onClick={onNext}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          下一题
        </button>
      </div>
    </div>
  );
}
