// 音乐理论核心数据定义

export const INTERVAL_NAMES = [
  'P1', 'm2', 'M2', 'm3', 'M3', 'P4', 'TT', 'P5', 'm6', 'M6', 'm7', 'M7', 'P8',
] as const;

export type IntervalName = typeof INTERVAL_NAMES[number];

export const INTERVAL_LABELS: Record<IntervalName, string> = {
  P1: '纯一度', m2: '小二度', M2: '大二度', m3: '小三度', M3: '大三度',
  P4: '纯四度', TT: '增四/减五度', P5: '纯五度', m6: '小六度', M6: '大六度',
  m7: '小七度', M7: '大七度', P8: '纯八度',
};

export const INTERVAL_SEMITONES: Record<IntervalName, number> = {
  P1: 0, m2: 1, M2: 2, m3: 3, M3: 4, P4: 5, TT: 6, P5: 7, m6: 8, M6: 9, m7: 10, M7: 11, P8: 12,
};

// 音程按难度分级
export const INTERVAL_DIFFICULTY = {
  beginner: ['P1', 'P4', 'P5', 'P8'] as IntervalName[],
  intermediate: ['P1', 'M2', 'm3', 'M3', 'P4', 'P5', 'm6', 'M6', 'P8'] as IntervalName[],
  advanced: INTERVAL_NAMES as readonly IntervalName[],
};

// 和弦类型
export const CHORD_TYPES = {
  major: { name: '大三和弦', label: '大三', intervals: [0, 4, 7] },
  minor: { name: '小三和弦', label: '小三', intervals: [0, 3, 7] },
  augmented: { name: '增三和弦', label: '增三', intervals: [0, 4, 8] },
  diminished: { name: '减三和弦', label: '减三', intervals: [0, 3, 6] },
  major7: { name: '大七和弦', label: '大七', intervals: [0, 4, 7, 11] },
  minor7: { name: '小七和弦', label: '小七', intervals: [0, 3, 7, 10] },
  dominant7: { name: '属七和弦', label: '属七', intervals: [0, 4, 7, 10] },
  diminished7: { name: '减七和弦', label: '减七', intervals: [0, 3, 6, 9] },
  halfDiminished7: { name: '半减七和弦', label: '半减七', intervals: [0, 3, 6, 10] },
} as const;

export type ChordType = keyof typeof CHORD_TYPES;

export const CHORD_DIFFICULTY = {
  beginner: ['major', 'minor'] as ChordType[],
  intermediate: ['major', 'minor', 'augmented', 'diminished'] as ChordType[],
  advanced: Object.keys(CHORD_TYPES) as ChordType[],
};

// 音阶类型
export const SCALE_TYPES = {
  major: { name: '自然大调', intervals: [0, 2, 4, 5, 7, 9, 11, 12] },
  naturalMinor: { name: '自然小调', intervals: [0, 2, 3, 5, 7, 8, 10, 12] },
  harmonicMinor: { name: '和声小调', intervals: [0, 2, 3, 5, 7, 8, 11, 12] },
  melodicMinor: { name: '旋律小调', intervals: [0, 2, 3, 5, 7, 9, 11, 12] },
  dorian: { name: 'Dorian 调式', intervals: [0, 2, 3, 5, 7, 9, 10, 12] },
  phrygian: { name: 'Phrygian 调式', intervals: [0, 1, 3, 5, 7, 8, 10, 12] },
  lydian: { name: 'Lydian 调式', intervals: [0, 2, 4, 6, 7, 9, 11, 12] },
  mixolydian: { name: 'Mixolydian 调式', intervals: [0, 2, 4, 5, 7, 9, 10, 12] },
  aeolian: { name: 'Aeolian 调式', intervals: [0, 2, 3, 5, 7, 8, 10, 12] },
  locrian: { name: 'Locrian 调式', intervals: [0, 1, 3, 5, 6, 8, 10, 12] },
  pentatonicMajor: { name: '大调五声音阶', intervals: [0, 2, 4, 7, 9, 12] },
  pentatonicMinor: { name: '小调五声音阶', intervals: [0, 3, 5, 7, 10, 12] },
  blues: { name: '布鲁斯音阶', intervals: [0, 3, 5, 6, 7, 10, 12] },
} as const;

export type ScaleType = keyof typeof SCALE_TYPES;

export const SCALE_DIFFICULTY = {
  beginner: ['major', 'naturalMinor'] as ScaleType[],
  intermediate: ['major', 'naturalMinor', 'harmonicMinor', 'melodicMinor', 'pentatonicMajor', 'pentatonicMinor'] as ScaleType[],
  advanced: Object.keys(SCALE_TYPES) as ScaleType[],
};

// 和声进行类型
export const PROGRESSION_TYPES = {
  'I-IV-V-I': { name: 'I-IV-V-I', degrees: [0, 3, 4, 0], label: '基础正格进行' },
  'I-V-vi-IV': { name: 'I-V-vi-IV', degrees: [0, 4, 5, 3], label: '流行进行' },
  'ii-V-I': { name: 'ii-V-I', degrees: [1, 4, 0], label: '爵士经典进行' },
  'I-vi-IV-V': { name: 'I-vi-IV-V', degrees: [0, 5, 3, 4], label: '50年代进行' },
  'I-IV-vi-V': { name: 'I-IV-vi-V', degrees: [0, 3, 5, 4], label: '抒情进行' },
  'vi-IV-I-V': { name: 'vi-IV-I-V', degrees: [5, 3, 0, 4], label: '小调流行进行' },
  'I-iii-IV-V': { name: 'I-iii-IV-V', degrees: [0, 2, 3, 4], label: '古典进行' },
  'I-IV-I-V': { name: 'I-IV-I-V', degrees: [0, 3, 0, 4], label: '布鲁斯基础' },
} as const;

export type ProgressionType = keyof typeof PROGRESSION_TYPES;

export const PROGRESSION_DIFFICULTY = {
  beginner: ['I-IV-V-I', 'I-V-vi-IV'] as ProgressionType[],
  intermediate: ['I-IV-V-I', 'I-V-vi-IV', 'I-vi-IV-V', 'I-IV-vi-V'] as ProgressionType[],
  advanced: Object.keys(PROGRESSION_TYPES) as ProgressionType[],
};

// 拍号
export const TIME_SIGNATURES = ['2/4', '3/4', '4/4', '6/8'] as const;
export type TimeSignature = typeof TIME_SIGNATURES[number];

// 节奏模式
export interface RhythmPattern {
  name: string;
  beats: number[];  // 每个元素为音符时值（以拍为单位）
  display: string;  // 显示文本
}

export const RHYTHM_PATTERNS: Record<string, RhythmPattern[]> = {
  beginner: [
    { name: '全音符', beats: [4], display: 'W' },
    { name: '二分音符x2', beats: [2, 2], display: 'H H' },
    { name: '四分音符x4', beats: [1, 1, 1, 1], display: 'Q Q Q Q' },
    { name: '二分+四分x2', beats: [2, 1, 1], display: 'H Q Q' },
    { name: '四分x2+二分', beats: [1, 1, 2], display: 'Q Q H' },
  ],
  intermediate: [
    { name: '八分音符x2+四分x2', beats: [0.5, 0.5, 1, 1], display: 'ee Q Q' },
    { name: '附点四分+八分+四分', beats: [1.5, 0.5, 1], display: 'Q. e Q' },
    { name: '四分+八分x4', beats: [1, 0.5, 0.5, 0.5, 0.5], display: 'Q ee ee' },
    { name: '切分节奏', beats: [0.5, 1, 0.5, 1], display: 'e Q e Q' },
    { name: '八分x4+四分', beats: [0.5, 0.5, 0.5, 0.5, 1], display: 'ee ee Q' },
  ],
  advanced: [
    { name: '十六分音符组', beats: [0.25, 0.25, 0.25, 0.25, 1, 1], display: 'ssss Q Q' },
    { name: '附点八分+十六分', beats: [0.75, 0.25, 0.75, 0.25, 1], display: 'e.s e.s Q' },
    { name: '三连音+四分', beats: [1/3, 1/3, 1/3, 1, 1], display: 'Q3 Q Q' },
    { name: '复杂切分', beats: [0.5, 0.5, 0.5, 1, 0.5], display: 'e e e Q e' },
    { name: '附点四分x2+四分', beats: [1.5, 0.5, 1.5, 0.5], display: 'Q.e Q.e' },
  ],
};
