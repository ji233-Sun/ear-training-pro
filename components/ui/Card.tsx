'use client';

import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = '', hover = false, onClick }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-zinc-200 bg-white p-6 shadow-sm ${hover ? 'cursor-pointer transition-all hover:shadow-md hover:border-zinc-300' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
