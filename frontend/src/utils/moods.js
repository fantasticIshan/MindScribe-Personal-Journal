export const MOODS = [
  { value: 'happy', label: 'Happy', glyph: '☀' },
  { value: 'calm', label: 'Calm', glyph: '〜' },
  { value: 'neutral', label: 'Neutral', glyph: '·' },
  { value: 'sad', label: 'Sad', glyph: '☂' },
  { value: 'anxious', label: 'Anxious', glyph: '⚡' },
  { value: 'excited', label: 'Excited', glyph: '✦' },
  { value: 'grateful', label: 'Grateful', glyph: '♥' },
  { value: 'tired', label: 'Tired', glyph: '☾' },
];

export const moodLabel = (value) => MOODS.find((m) => m.value === value)?.label || 'Neutral';
export const moodGlyph = (value) => MOODS.find((m) => m.value === value)?.glyph || '·';
