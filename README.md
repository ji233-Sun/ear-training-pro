# Ear Training Pro

A comprehensive, feature-rich solfege and ear training web application built with Next.js, Tone.js, and VexFlow.

## Features

- **Interval Recognition** - Identify melodic and harmonic intervals (ascending/descending) with 3 difficulty levels
- **Chord Recognition** - Identify triads (major, minor, augmented, diminished) and seventh chords with inversion support
- **Scale & Mode Recognition** - Identify major/minor scales, church modes, pentatonic, and blues scales
- **Rhythm Training** - Listen and identify rhythm patterns with visual playback indicator
- **Melodic Dictation** - Transcribe melodies using a virtual piano keyboard with staff notation display
- **Chord Progression** - Identify common chord progressions (I-IV-V-I, ii-V-I, etc.)
- **Pitch Training** - Absolute pitch identification and pitch comparison exercises
- **Sight-Singing Practice** - Read and sing from generated sheet music, then verify with playback

## General Features

- Dashboard with progress overview and statistics for all modules
- Practice stats: accuracy, streaks, daily history
- Multiple instrument timbres (Piano, Synth, Organ)
- Keyboard shortcuts (Space to replay, number keys to select answers)
- Local storage persistence for all settings and progress
- Responsive layout for desktop and tablet

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [TypeScript 5](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Tone.js](https://tonejs.github.io/) - Audio synthesis
- [VexFlow](https://www.vexflow.com/) - Staff notation rendering
- [Lucide React](https://lucide.dev/) - Icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/              # Next.js App Router pages (dashboard + 8 training modules)
components/
  layout/         # Sidebar, Header
  music/          # StaffRenderer, PianoKeyboard, RhythmDisplay
  training/       # OptionButton, ResultFeedback, DifficultySelector, etc.
  ui/             # Button, Card, Modal
hooks/            # useAudioEngine, useTrainingSession, useStats
lib/
  audio/          # Tone.js engine, instruments, player
  music/          # Music theory, intervals, chords, scales, rhythm, melody, progression
  constants.ts    # Global constants and module config
  store.ts        # localStorage persistence
```

## License

[MIT](LICENSE)
