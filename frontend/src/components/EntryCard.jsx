import React from 'react';
import { Link } from 'react-router-dom';
import { moodGlyph, moodLabel } from '../utils/moods.js';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });

const excerpt = (text, max = 160) => (text.length > max ? `${text.slice(0, max).trim()}…` : text);

export default function EntryCard({ entry }) {
  return (
    <Link
      to={`/journal/${entry._id}`}
      className={`stitched-edge ${entry.favorite ? 'dog-ear' : ''} group block rounded-page border border-line
        bg-white/70 py-5 pr-5 shadow-page transition-transform hover:-translate-y-0.5 hover:border-accent`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">
            {formatDate(entry.entryDate)}
          </p>
          <h3 className="mt-1 font-display text-lg font-medium text-ink group-hover:text-accent-dark">
            {entry.title}
          </h3>
        </div>
        <span
          title={moodLabel(entry.mood)}
          className="shrink-0 rounded-full border border-line bg-paper px-2.5 py-1 font-body text-xs text-ink-soft"
        >
          {moodGlyph(entry.mood)} {moodLabel(entry.mood)}
        </span>
      </div>

      <p className="mt-3 font-journal text-[15px] leading-relaxed text-ink-soft">{excerpt(entry.content)}</p>

      {entry.tags?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {entry.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-paper-dark px-2 py-0.5 font-mono text-[11px] text-ink-soft">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
