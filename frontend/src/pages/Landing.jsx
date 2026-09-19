import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <div className="grid items-center gap-16 md:grid-cols-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-dark">
            A quiet place for your thoughts
          </p>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.1] tracking-tight text-ink">
            Write it down.
            <br />
            Keep it yours.
          </h1>
          <p className="mt-6 max-w-md font-journal text-lg leading-relaxed text-ink-soft">
            MindScribe is a distraction-free journal for daily reflection — encrypted passwords,
            HTTP-only session cookies, and entries only you can ever read.
          </p>
          <div className="mt-8 flex gap-3">
            <Link to="/register" className="btn-primary">
              Start writing
            </Link>
            <Link to="/login" className="btn-secondary">
              I already have an account
            </Link>
          </div>
        </div>

        {/* Signature element: a stack of "bound pages" evoking a real notebook */}
        <div className="relative mx-auto h-72 w-full max-w-sm">
          <div className="absolute inset-x-6 top-6 h-full rounded-page border border-line bg-paper-dark shadow-page" />
          <div className="absolute inset-x-3 top-3 h-full rounded-page border border-line bg-white/70 shadow-page" />
          <div className="stitched-edge dog-ear absolute inset-0 rounded-page border border-line bg-white shadow-page">
            <div className="flex h-full flex-col justify-between py-6 pr-6">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">23 Aug 2026</p>
                <h3 className="mt-1 font-display text-xl text-ink">Today's page</h3>
              </div>
              <p className="font-journal italic leading-relaxed text-ink-soft">
                "Some days the page is where the thinking actually happens."
              </p>
              <div className="flex gap-1.5">
                {['#gratitude', '#focus'].map((t) => (
                  <span key={t} className="rounded-full bg-paper-dark px-2 py-0.5 font-mono text-[11px] text-ink-soft">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-24 grid gap-8 border-t border-line pt-12 sm:grid-cols-3">
        {[
          {
            title: 'Private by design',
            body: 'Passwords are hashed with bcrypt; sessions live in HTTP-only cookies your scripts can never read.',
          },
          {
            title: 'Built for daily habit',
            body: 'Mood tags, tags, and a clean full-text search make it easy to find and revisit any page.',
          },
          {
            title: 'Yours, structured',
            body: 'A validated MongoDB schema keeps every entry consistent, timestamped, and easy to export later.',
          },
        ].map((f) => (
          <div key={f.title}>
            <h4 className="font-display text-base font-medium text-ink">{f.title}</h4>
            <p className="mt-2 font-body text-sm leading-relaxed text-ink-soft">{f.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
