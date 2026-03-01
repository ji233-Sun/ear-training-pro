'use client';

import Link from 'next/link';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/training/ProgressBar';
import { MODULE_CONFIG, type ModuleKey } from '@/lib/constants';
import { useStats } from '@/hooks/useStats';
import {
  Music, Piano, ListMusic, Drum, PenLine, AudioLines, Volume2, BookOpen,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Music, Piano, ListMusic, Drum, PenLine, AudioLines, Volume2, BookOpen,
};

const modules = Object.entries(MODULE_CONFIG) as [ModuleKey, typeof MODULE_CONFIG[ModuleKey]][];

export default function Dashboard() {
  const { stats, totalAttempts, totalCorrect, overallAccuracy, getModuleAccuracy } = useStats();

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">仪表盘</h1>
        <p className="mt-2 text-zinc-600">选择训练模块开始练习，追踪你的进步</p>
      </div>

      {/* 统计概览 */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-zinc-500">总练习次数</p>
          <p className="mt-1 text-3xl font-bold">{totalAttempts}</p>
        </Card>
        <Card>
          <p className="text-sm text-zinc-500">正确次数</p>
          <p className="mt-1 text-3xl font-bold text-green-600">{totalCorrect}</p>
        </Card>
        <Card>
          <p className="text-sm text-zinc-500">总正确率</p>
          <div className="mt-1 flex items-end gap-2">
            <p className="text-3xl font-bold">{overallAccuracy}%</p>
            <ProgressBar value={overallAccuracy} className="mb-2 flex-1" />
          </div>
        </Card>
      </div>

      {/* 模块卡片 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {modules.map(([key, config]) => {
          const accuracy = getModuleAccuracy(key);
          const moduleStats = stats?.[key];
          const Icon = ICON_MAP[config.icon];
          return (
            <Link key={key} href={config.path}>
              <Card hover className="h-full">
                <div className="flex items-start justify-between">
                  {Icon && <Icon className="h-8 w-8 text-zinc-600" />}
                  <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${config.color}`}>
                    {accuracy}%
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-zinc-900">{config.name}</h3>
                <div className="mt-2">
                  <ProgressBar value={accuracy} />
                </div>
                <div className="mt-3 flex justify-between text-xs text-zinc-500">
                  <span>练习 {moduleStats?.totalAttempts || 0} 次</span>
                  {moduleStats?.lastPracticed && (
                    <span>最近：{moduleStats.lastPracticed}</span>
                  )}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
