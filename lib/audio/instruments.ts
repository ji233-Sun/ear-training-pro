// 音色配置（在 audioEngine.ts 中已包含核心实现，此文件提供额外的音色信息）

import type { InstrumentType } from '@/lib/constants';
import { INSTRUMENT_LABELS } from '@/lib/constants';

export interface InstrumentInfo {
  type: InstrumentType;
  label: string;
  description: string;
}

export const INSTRUMENT_INFO: InstrumentInfo[] = [
  { type: 'piano', label: INSTRUMENT_LABELS.piano, description: '明亮清脆的钢琴音色，适合大部分练习' },
  { type: 'synth', label: INSTRUMENT_LABELS.synth, description: '电子合成器音色，音色独特' },
  { type: 'organ', label: INSTRUMENT_LABELS.organ, description: '柔和的管风琴音色，适合和声练习' },
];
