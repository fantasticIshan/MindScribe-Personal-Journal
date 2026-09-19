import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import EntryCard from '../components/EntryCard.jsx';
import Loader from '../components/Loader.jsx';
import { MOODS } from '../utils/moods.js';

export default function Dashboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [mood, setMood] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page };
      if (search.trim()) params.search = search.trim();
      if (mood) params.mood = mood;
      const { data } = await api.get('/entries', { params });
      setEntries(data.entries);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load your entries. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, search, mood]);

  useEffect(() => {
    const timeout = setTimeout(fetchEntries, 250); // debounce search typing
    return () => clearTimeout(timeout);
  }, [fetchEntries]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-ink-faint">Your journal</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink">Every page you've written</h1>
        </div>
        <Link to="/journal/new" className="btn-primary self-start">
          New entry
        </Link>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          placeholder="Search your entries…"
          className="input-field sm:max-w-xs"
        />
        <select
          value={mood}
          onChange={(e) => {
            setPage(1);
            setMood(e.target.value);
          }}
          className="input-field sm:max-w-[10rem]"
        >
          <option value="">All moods</option>
          {MOODS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.glyph} {m.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-8">
        {loading && <Loader label="Turning the pages…" />}

        {!loading && error && (
          <p className="rounded-page border border-brick/30 bg-brick/5 px-4 py-3 text-sm text-brick">{error}</p>
        )}

        {!loading && !error && entries.length === 0 && (
          <div className="rounded-page border border-dashed border-line py-16 text-center">
            <p className="font-display text-lg text-ink">This page is still blank.</p>
            <p className="mt-1 font-body text-sm text-ink-soft">
              {search || mood ? 'Nothing matches that search yet.' : 'Write your first entry to begin your journal.'}
            </p>
            {!search && !mood && (
              <Link to="/journal/new" className="btn-primary mt-5 inline-flex">
                Write your first entry
              </Link>
            )}
          </div>
        )}

        {!loading && !error && entries.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2">
            {entries.map((entry) => (
              <EntryCard key={entry._id} entry={entry} />
            ))}
          </div>
        )}

        {!loading && !error && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-secondary !px-4 !py-2"
            >
              Previous
            </button>
            <span className="font-mono text-xs uppercase tracking-widest text-ink-faint">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn-secondary !px-4 !py-2"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
