import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-ink-faint">404</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink">This page was torn out.</h1>
      <p className="mt-3 font-body text-sm text-ink-soft">There's nothing to read here.</p>
      <Link to="/" className="btn-primary mt-6 inline-flex">
        Back to safety
      </Link>
    </div>
  );
}
