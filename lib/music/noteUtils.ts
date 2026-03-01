// 音符工具函数

import { NOTE_NAMES } from '@/lib/constants';

/** 将 MIDI 音符号转为音名（如 60 → "C4"） */
export function midiToNoteName(midi: number): string {
  const octave = Math.floor(midi / 12) - 1;
  const noteIndex = midi % 12;
  return `${NOTE_NAMES[noteIndex]}${octave}`;
}

/** 将音名转为 MIDI 号（如 "C4" → 60） */
export function noteNameToMidi(name: string): number {
  const match = name.match(/^([A-G]#?)(\d)$/);
  if (!match) throw new Error(`Invalid note name: ${name}`);
  const [, note, octaveStr] = match;
  const noteIndex = NOTE_NAMES.indexOf(note as typeof NOTE_NAMES[number]);
  if (noteIndex === -1) throw new Error(`Invalid note: ${note}`);
  return (parseInt(octaveStr) + 1) * 12 + noteIndex;
}

/** 将音名转为 Tone.js 格式（"C#4" → "C#4"，已经是正确格式） */
export function noteToToneFormat(name: string): string {
  return name;
}

/** 获取指定范围内的随机音符 MIDI 号 */
export function randomMidi(minMidi: number = 48, maxMidi: number = 84): number {
  return Math.floor(Math.random() * (maxMidi - minMidi + 1)) + minMidi;
}

/** 获取随机音符名 */
export function randomNoteName(minMidi: number = 48, maxMidi: number = 84): string {
  return midiToNoteName(randomMidi(minMidi, maxMidi));
}

/** 获取音符的频率 */
export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/** 获取音符的简短显示名（不含八度） */
export function noteDisplayName(noteName: string): string {
  return noteName.replace(/\d+$/, '');
}

/** 判断两个 MIDI 音符是否是同一个音高类（不考虑八度） */
export function isSamePitchClass(midi1: number, midi2: number): boolean {
  return midi1 % 12 === midi2 % 12;
}

/** 生成一个大调音阶上的音符序列（MIDI） */
export function majorScaleNotes(rootMidi: number): number[] {
  const steps = [0, 2, 4, 5, 7, 9, 11, 12];
  return steps.map(s => rootMidi + s);
}

/** 音符名转为 VexFlow 格式（如 "C#4" → "c#/4"） */
export function noteToVexFlow(noteName: string): string {
  const match = noteName.match(/^([A-G]#?)(\d)$/);
  if (!match) return 'c/4';
  const [, note, octave] = match;
  return `${note.toLowerCase()}/${octave}`;
}

/** 从 VexFlow 格式转回标准音名 */
export function vexFlowToNote(vexNote: string): string {
  const [note, octave] = vexNote.split('/');
  return `${note.charAt(0).toUpperCase()}${note.slice(1)}${octave}`;
}
