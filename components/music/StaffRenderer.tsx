'use client';

import { useEffect, useRef } from 'react';

interface StaffRendererProps {
  notes: string[];          // VexFlow 格式的音符，如 ["c/4", "e/4", "g/4"]
  durations?: string[];     // 时值，如 ["q", "q", "q"]
  clef?: 'treble' | 'bass';
  timeSignature?: string;
  keySignature?: string;
  width?: number;
  height?: number;
}

export default function StaffRenderer({
  notes,
  durations,
  clef = 'treble',
  timeSignature = '4/4',
  keySignature = 'C',
  width = 600,
  height = 180,
}: StaffRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || notes.length === 0) return;

    // 动态导入 VexFlow（避免 SSR 问题）
    import('vexflow').then(({ Renderer, Stave, StaveNote, Voice, Formatter }) => {

      const container = containerRef.current!;
      container.innerHTML = '';

      const renderer = new Renderer(container, Renderer.Backends.SVG);
      renderer.resize(width, height);
      const context = renderer.getContext();
      context.setFont('Arial', 10);

      const stave = new Stave(10, 20, width - 30);
      stave.addClef(clef);
      stave.addTimeSignature(timeSignature);
      if (keySignature !== 'C') {
        stave.addKeySignature(keySignature);
      }
      stave.setContext(context).draw();

      if (notes.length > 0) {
        const staveNotes = notes.map((note, i) => {
          const duration = durations?.[i] || 'q';
          return new StaveNote({
            keys: [note],
            duration,
            clef,
          });
        });

        try {
          const voice = new Voice({
            numBeats: parseInt(timeSignature.split('/')[0]),
            beatValue: parseInt(timeSignature.split('/')[1]),
          }).setMode(Voice.Mode.SOFT);
          voice.addTickables(staveNotes);

          new Formatter().joinVoices([voice]).format([voice], width - 80);
          voice.draw(context, stave);
        } catch {
          // 如果严格模式失败，尝试宽松渲染
          staveNotes.forEach((note, i) => {
            const x = 80 + (i * (width - 120)) / Math.max(notes.length, 1);
            note.setStave(stave);
            try {
              note.setContext(context).draw();
            } catch {
              // 忽略个别音符渲染错误
            }
            void x;
          });
        }
      }
    }).catch(() => {
      // VexFlow 加载失败时的静默处理
    });
  }, [notes, durations, clef, timeSignature, keySignature, width, height]);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center overflow-hidden rounded-lg bg-white"
      style={{ width, height }}
    />
  );
}
