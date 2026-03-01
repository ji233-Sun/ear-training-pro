// 全局常量

export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;
export const NOTE_NAMES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'] as const;

export const OCTAVE_RANGE = { min: 2, max: 6 } as const;
export const DEFAULT_BPM = 120;
export const DEFAULT_VELOCITY = 0.8;

export const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
export type DifficultyLevel = typeof DIFFICULTY_LEVELS[number];

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级',
};

export const MODULE_CONFIG = {
  interval: { name: '音程识别', path: '/interval', icon: 'Music', color: 'bg-blue-500' },
  chord: { name: '和弦识别', path: '/chord', icon: 'Piano', color: 'bg-purple-500' },
  scale: { name: '音阶/调式', path: '/scale', icon: 'ListMusic', color: 'bg-green-500' },
  rhythm: { name: '节奏训练', path: '/rhythm', icon: 'Drum', color: 'bg-orange-500' },
  dictation: { name: '旋律听写', path: '/dictation', icon: 'PenLine', color: 'bg-pink-500' },
  progression: { name: '和声进行', path: '/progression', icon: 'AudioLines', color: 'bg-teal-500' },
  pitch: { name: '音高辨别', path: '/pitch', icon: 'Volume2', color: 'bg-indigo-500' },
  'sight-singing': { name: '视唱练习', path: '/sight-singing', icon: 'BookOpen', color: 'bg-red-500' },
} as const;

export type ModuleKey = keyof typeof MODULE_CONFIG;

export const INSTRUMENTS = ['piano', 'synth', 'organ'] as const;
export type InstrumentType = typeof INSTRUMENTS[number];

export const INSTRUMENT_LABELS: Record<InstrumentType, string> = {
  piano: '钢琴',
  synth: '合成器',
  organ: '管风琴',
};
