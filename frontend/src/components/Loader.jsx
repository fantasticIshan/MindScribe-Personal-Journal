import React from 'react';

export default function Loader({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-ink-faint">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-line border-t-accent" />
      <p className="font-mono text-xs uppercase tracking-widest">{label}</p>
    </div>
  );
}
