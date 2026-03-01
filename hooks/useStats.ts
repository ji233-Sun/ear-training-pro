// 统计数据 Hook
'use client';

import { useState, useEffect } from 'react';
import { getAllStats, type ModuleStats } from '@/lib/store';
import type { ModuleKey } from '@/lib/constants';

export function useStats() {
  const [stats, setStats] = useState<Record<ModuleKey, ModuleStats> | null>(null);

  useEffect(() => {
    setStats(getAllStats());
  }, []);

  const refresh = () => {
    setStats(getAllStats());
  };

  const totalAttempts = stats
    ? Object.values(stats).reduce((sum, s) => sum + s.totalAttempts, 0)
    : 0;

  const totalCorrect = stats
    ? Object.values(stats).reduce((sum, s) => sum + s.correctAttempts, 0)
    : 0;

  const overallAccuracy = totalAttempts > 0
    ? Math.round((totalCorrect / totalAttempts) * 100)
    : 0;

  const getModuleAccuracy = (module: ModuleKey): number => {
    if (!stats) return 0;
    const s = stats[module];
    return s.totalAttempts > 0 ? Math.round((s.correctAttempts / s.totalAttempts) * 100) : 0;
  };

  return {
    stats,
    refresh,
    totalAttempts,
    totalCorrect,
    overallAccuracy,
    getModuleAccuracy,
  };
}
