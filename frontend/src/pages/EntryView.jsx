import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios.js';
import Loader from '../components/Loader.jsx';
import { moodGlyph, moodLabel } from '../utils/moods.js';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

export default function EntryView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get(`/entries/${id}`);
        setEntry(data.entry);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not find that entry.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const toggleFavorite = async () => {
    try {
      const { data } = await api.put(`/entries/${id}`, { favorite: !entry.favorite });
      setEntry(data.entry);
    } catch {
      // Non-critical action; fail silently in the UI beyond leaving state unchanged
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/entries/${id}`);
      navigate('/journal');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete this entry.');
      setDeleting(false);
    }
  };

  if (loading) return <Loader label="Opening this page…" />;

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="rounded-page border border-brick/30 bg-brick/5 px-4 py-3 text-sm text-brick">{error}</p>
        <Link to="/journal" className="btn-secondary mt-6 inline-flex">
          Back to your journal
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link to="/journal" className="font-mono text-xs uppercase tracking-widest text-ink-faint hover:text-accent-dark">
        ← Back to journal
      </Link>

      <article
        className={`stitched-edge ${entry.favorite ? 'dog-ear' : ''} mt-6 rounded-page border border-line bg-white/70 py-8 pr-8 shadow-page`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-ink-faint">{formatDate(entry.entryDate)}</p>
            <h1 className="mt-1 font-display text-3xl font-semibold text-ink">{entry.title}</h1>
          </div>
          <span className="shrink-0 rounded-full border border-line bg-paper px-3 py-1 font-body text-xs text-ink-soft">
            {moodGlyph(entry.mood)} {moodLabel(entry.mood)}
          </span>
        </div>

        {entry.tags?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {entry.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-paper-dark px-2 py-0.5 font-mono text-[11px] text-ink-soft">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <p className="mt-6 whitespace-pre-wrap font-journal text-[17px] leading-loose text-ink">{entry.content}</p>

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-line pt-6">
          <button onClick={toggleFavorite} className="btn-secondary">
            {entry.favorite ? '♥ Remove favorite' : '♡ Mark as favorite'}
          </button>
          <Link to={`/journal/${id}/edit`} className="btn-secondary">
            Edit entry
          </Link>

          {!confirmingDelete ? (
            <button onClick={() => setConfirmingDelete(true)} className="ml-auto font-body text-sm text-brick hover:underline">
              Delete entry
            </button>
          ) : (
            <div className="ml-auto flex items-center gap-3">
              <span className="font-body text-sm text-ink-soft">Delete this entry permanently?</span>
              <button onClick={handleDelete} disabled={deleting} className="font-body text-sm font-medium text-brick hover:underline">
                {deleting ? 'Deleting…' : 'Yes, delete'}
              </button>
              <button onClick={() => setConfirmingDelete(false)} className="font-body text-sm text-ink-soft hover:underline">
                Cancel
              </button>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
