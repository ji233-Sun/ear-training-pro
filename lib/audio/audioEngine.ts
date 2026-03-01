// Tone.js 音频引擎封装
'use client';

import * as Tone from 'tone';
import type { InstrumentType } from '@/lib/constants';

let isInitialized = false;
let currentInstrument: Tone.PolySynth | null = null;
let currentInstrumentType: InstrumentType = 'piano';

const INSTRUMENT_CONFIGS: Record<InstrumentType, () => Tone.PolySynth> = {
  piano: () => new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'triangle8' },
    envelope: { attack: 0.005, decay: 0.3, sustain: 0.2, release: 1.2 },
    volume: -8,
  }),
  synth: () => new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'sawtooth' },
    envelope: { attack: 0.05, decay: 0.2, sustain: 0.5, release: 0.8 },
    volume: -12,
  }),
  organ: () => new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'sine' },
    envelope: { attack: 0.1, decay: 0.1, sustain: 0.8, release: 0.5 },
    volume: -10,
  }),
};

export async function initAudio(): Promise<void> {
  if (isInitialized) return;
  await Tone.start();
  isInitialized = true;
}

export function isAudioReady(): boolean {
  return isInitialized;
}

function getInstrument(type: InstrumentType): Tone.PolySynth {
  if (currentInstrument && currentInstrumentType === type) {
    return currentInstrument;
  }
  if (currentInstrument) {
    currentInstrument.dispose();
  }
  currentInstrument = INSTRUMENT_CONFIGS[type]().toDestination();
  currentInstrumentType = type;
  return currentInstrument;
}

/** 播放单个音符 */
export function playNote(
  note: string,
  duration: string = '4n',
  instrument: InstrumentType = 'piano',
  time?: number,
): void {
  const synth = getInstrument(instrument);
  const now = time ?? Tone.now();
  synth.triggerAttackRelease(note, duration, now);
}

/** 播放多个音符（和弦，同时发声） */
export function playChord(
  notes: string[],
  duration: string = '2n',
  instrument: InstrumentType = 'piano',
): void {
  const synth = getInstrument(instrument);
  synth.triggerAttackRelease(notes, duration);
}

/** 顺序播放音符序列（旋律） */
export function playSequence(
  notes: string[],
  noteDuration: number = 0.5,
  instrument: InstrumentType = 'piano',
): Promise<void> {
  return new Promise((resolve) => {
    const synth = getInstrument(instrument);
    const now = Tone.now();
    notes.forEach((note, i) => {
      synth.triggerAttackRelease(note, '4n', now + i * noteDuration);
    });
    setTimeout(resolve, notes.length * noteDuration * 1000 + 500);
  });
}

/** 播放和弦进行 */
export function playChordProgression(
  chords: string[][],
  chordDuration: number = 1.0,
  instrument: InstrumentType = 'piano',
): Promise<void> {
  return new Promise((resolve) => {
    const synth = getInstrument(instrument);
    const now = Tone.now();
    chords.forEach((chord, i) => {
      synth.triggerAttackRelease(chord, '2n', now + i * chordDuration);
    });
    setTimeout(resolve, chords.length * chordDuration * 1000 + 500);
  });
}

/** 播放节奏（使用单一音高的节拍声） */
export function playRhythm(
  beats: number[],
  bpm: number = 120,
  instrument: InstrumentType = 'piano',
): Promise<void> {
  return new Promise((resolve) => {
    const synth = getInstrument(instrument);
    const beatDuration = 60 / bpm;
    const now = Tone.now();
    let time = 0;
    beats.forEach((beat) => {
      synth.triggerAttackRelease('C5', beat * beatDuration * 0.8, now + time * beatDuration);
      time += beat;
    });
    setTimeout(resolve, time * beatDuration * 1000 + 500);
  });
}

/** 播放两个音（用于音程识别） */
export function playInterval(
  note1: string,
  note2: string,
  mode: 'melodic' | 'harmonic' = 'melodic',
  instrument: InstrumentType = 'piano',
): Promise<void> {
  if (mode === 'harmonic') {
    playChord([note1, note2], '2n', instrument);
    return new Promise(resolve => setTimeout(resolve, 1500));
  } else {
    return playSequence([note1, note2], 0.6, instrument);
  }
}

/** 设置主音量 */
export function setVolume(volume: number): void {
  Tone.getDestination().volume.value = Tone.gainToDb(volume);
}

/** 停止所有声音 */
export function stopAll(): void {
  if (currentInstrument) {
    currentInstrument.releaseAll();
  }
}
