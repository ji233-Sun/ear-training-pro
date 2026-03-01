'use client';

import { useCallback, useMemo } from 'react';

interface PianoKeyboardProps {
  startNote?: number;   // 起始 MIDI 号 (默认 48 = C3)
  endNote?: number;     // 结束 MIDI 号 (默认 84 = C6)
  activeNotes?: number[]; // 高亮的音符 MIDI
  onNoteClick?: (midi: number, noteName: string) => void;
  compact?: boolean;
}

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function isBlackKey(midi: number): boolean {
  const note = midi % 12;
  return [1, 3, 6, 8, 10].includes(note);
}

function midiToName(midi: number): string {
  const octave = Math.floor(midi / 12) - 1;
  return `${NOTE_NAMES[midi % 12]}${octave}`;
}

export default function PianoKeyboard({
  startNote = 48,
  endNote = 84,
  activeNotes = [],
  onNoteClick,
  compact = false,
}: PianoKeyboardProps) {
  const keys = useMemo(() => {
    const result = [];
    for (let midi = startNote; midi <= endNote; midi++) {
      result.push({
        midi,
        name: midiToName(midi),
        isBlack: isBlackKey(midi),
        isActive: activeNotes.includes(midi),
      });
    }
    return result;
  }, [startNote, endNote, activeNotes]);

  const whiteKeys = keys.filter(k => !k.isBlack);
  const blackKeys = keys.filter(k => k.isBlack);

  const handleClick = useCallback((midi: number, name: string) => {
    onNoteClick?.(midi, name);
  }, [onNoteClick]);

  const keyHeight = compact ? 100 : 140;
  const whiteKeyWidth = compact ? 28 : 36;
  const totalWidth = whiteKeys.length * whiteKeyWidth;

  // 计算黑键位置
  function getBlackKeyLeft(midi: number): number {
    // 找到这个黑键左边白键的索引
    let whiteIndex = 0;
    for (let m = startNote; m < midi; m++) {
      if (!isBlackKey(m)) whiteIndex++;
    }
    return whiteIndex * whiteKeyWidth - (compact ? 9 : 11);
  }

  return (
    <div className="overflow-x-auto pb-2">
      <div className="relative" style={{ width: totalWidth, height: keyHeight }}>
        {/* 白键 */}
        {whiteKeys.map((key, i) => (
          <button
            key={key.midi}
            onClick={() => handleClick(key.midi, key.name)}
            className={`absolute top-0 border border-zinc-300 rounded-b-md transition-colors ${
              key.isActive
                ? 'bg-blue-400 border-blue-500'
                : 'bg-white hover:bg-zinc-100 active:bg-zinc-200'
            }`}
            style={{
              left: i * whiteKeyWidth,
              width: whiteKeyWidth - 1,
              height: keyHeight,
              zIndex: 1,
            }}
            title={key.name}
          >
            {!compact && (
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs text-zinc-400">
                {key.name.replace(/\d/, '')}
              </span>
            )}
          </button>
        ))}
        {/* 黑键 */}
        {blackKeys.map(key => (
          <button
            key={key.midi}
            onClick={() => handleClick(key.midi, key.name)}
            className={`absolute top-0 rounded-b-md transition-colors ${
              key.isActive
                ? 'bg-blue-600 border-blue-700'
                : 'bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600'
            }`}
            style={{
              left: getBlackKeyLeft(key.midi),
              width: compact ? 18 : 22,
              height: keyHeight * 0.6,
              zIndex: 2,
            }}
            title={key.name}
          />
        ))}
      </div>
    </div>
  );
}
