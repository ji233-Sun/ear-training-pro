// localStorage 数据持久化

import type { ModuleKey } from './constants';
import type { DifficultyLevel, InstrumentType } from './constants';

export interface ModuleStats {
  totalAttempts: number;
  correctAttempts: number;
  streak: number;
  bestStreak: number;
  lastPracticed: string | null;
  history: { date: string; correct: number; total: number }[];
}

export interface AppSettings {
  instrument: InstrumentType;
  volume: number;
  difficulty: Record<ModuleKey, DifficultyLevel>;
}

const STATS_KEY = 'ear-training-stats';
const SETTINGS_KEY = 'ear-training-settings';

function getDefaultStats(): ModuleStats {
  return {
    totalAttempts: 0,
    correctAttempts: 0,
    streak: 0,
    bestStreak: 0,
    lastPracticed: null,
    history: [],
  };
}

function getDefaultSettings(): AppSettings {
  return {
    instrument: 'piano',
    volume: 0.8,
    difficulty: {
      interval: 'beginner',
      chord: 'beginner',
      scale: 'beginner',
      rhythm: 'beginner',
      dictation: 'beginner',
      progression: 'beginner',
      pitch: 'beginner',
      'sight-singing': 'beginner',
    },
  };
}

export function getAllStats(): Record<ModuleKey, ModuleStats> {
  if (typeof window === 'undefined') {
    const modules: ModuleKey[] = ['interval', 'chord', 'scale', 'rhythm', 'dictation', 'progression', 'pitch', 'sight-singing'];
    return Object.fromEntries(modules.map(m => [m, getDefaultStats()])) as Record<ModuleKey, ModuleStats>;
  }
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const modules: ModuleKey[] = ['interval', 'chord', 'scale', 'rhythm', 'dictation', 'progression', 'pitch', 'sight-singing'];
  return Object.fromEntries(modules.map(m => [m, getDefaultStats()])) as Record<ModuleKey, ModuleStats>;
}

export function getModuleStats(module: ModuleKey): ModuleStats {
  const all = getAllStats();
  return all[module] || getDefaultStats();
}

export function updateModuleStats(module: ModuleKey, correct: boolean): void {
  if (typeof window === 'undefined') return;
  const all = getAllStats();
  const stats = all[module] || getDefaultStats();

  stats.totalAttempts++;
  if (correct) {
    stats.correctAttempts++;
    stats.streak++;
    stats.bestStreak = Math.max(stats.bestStreak, stats.streak);
  } else {
    stats.streak = 0;
  }

  const today = new Date().toISOString().split('T')[0];
  stats.lastPracticed = today;

  const todayEntry = stats.history.find(h => h.date === today);
  if (todayEntry) {
    todayEntry.total++;
    if (correct) todayEntry.correct++;
  } else {
    stats.history.push({ date: today, correct: correct ? 1 : 0, total: 1 });
    // 只保留最近30天
    if (stats.history.length > 30) stats.history.shift();
  }

  all[module] = stats;
  localStorage.setItem(STATS_KEY, JSON.stringify(all));
}

export function getSettings(): AppSettings {
  if (typeof window === 'undefined') return getDefaultSettings();
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...getDefaultSettings(), ...JSON.parse(raw) };
  } catch {}
  return getDefaultSettings();
}

export function updateSettings(partial: Partial<AppSettings>): void {
  if (typeof window === 'undefined') return;
  const settings = getSettings();
  const updated = { ...settings, ...partial };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
}

export function getModuleDifficulty(module: ModuleKey): DifficultyLevel {
  return getSettings().difficulty[module];
}

export function setModuleDifficulty(module: ModuleKey, level: DifficultyLevel): void {
  const settings = getSettings();
  settings.difficulty[module] = level;
  updateSettings(settings);
}
