'use client';

import { useEffect, useState } from 'react';
import { getSettings, updateSettings } from '@/lib/store';
import { INSTRUMENTS, INSTRUMENT_LABELS, type InstrumentType } from '@/lib/constants';
import { Volume2 } from 'lucide-react';

export default function Header() {
  const [instrument, setInstrument] = useState<InstrumentType>('piano');
  const [volume, setVolume] = useState(0.8);

  useEffect(() => {
    const settings = getSettings();
    setInstrument(settings.instrument);
    setVolume(settings.volume);
  }, []);

  function handleInstrumentChange(type: InstrumentType) {
    setInstrument(type);
    updateSettings({ instrument: type });
  }

  function handleVolumeChange(v: number) {
    setVolume(v);
    updateSettings({ volume: v });
  }

  return (
    <header className="flex h-16 items-center justify-end gap-4 border-b border-zinc-200 bg-white px-6">
      {/* 音色选择 */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-zinc-500">音色：</label>
        <select
          value={instrument}
          onChange={(e) => handleInstrumentChange(e.target.value as InstrumentType)}
          className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-sm"
        >
          {INSTRUMENTS.map(inst => (
            <option key={inst} value={inst}>{INSTRUMENT_LABELS[inst]}</option>
          ))}
        </select>
      </div>

      {/* 音量 */}
      <div className="flex items-center gap-2">
        <Volume2 className="h-4 w-4 text-zinc-500" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          className="w-20 accent-blue-600"
        />
      </div>
    </header>
  );
}
