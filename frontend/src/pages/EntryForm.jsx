import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios.js';
import Loader from '../components/Loader.jsx';
import { MOODS } from '../utils/moods.js';

const emptyForm = { title: '', content: '', mood: 'neutral', tags: '' };

export default function EntryForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEditing);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditing) return;
    (async () => {
      try {
        const { data } = await api.get(`/entries/${id}`);
        const e = data.entry;
        setForm({ title: e.title, content: e.content, mood: e.mood, tags: e.tags.join(', ') });
      } catch (err) {
        setServerError(err.response?.data?.message || 'Could not load this entry.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEditing]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = 'Give your entry a title.';
    else if (form.title.length > 120) next.title = 'Title must be under 120 characters.';
    if (!form.content.trim()) next.content = "Today's page shouldn't be empty.";
    else if (form.content.length > 20000) next.content = 'Entry is too long (max 20,000 characters).';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      mood: form.mood,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    setSubmitting(true);
    try {
      if (isEditing) {
        const { data } = await api.put(`/entries/${id}`, payload);
        navigate(`/journal/${data.entry._id}`);
      } else {
        const { data } = await api.post('/entries', payload);
        navigate(`/journal/${data.entry._id}`);
      }
    } catch (err) {
      setServerError(err.response?.data?.message || 'Could not save this entry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader label="Opening this page…" />;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-ink">
        {isEditing ? 'Edit entry' : "Today's entry"}
      </h1>

      <form onSubmit={handleSubmit} noValidate className="stitched-edge mt-8 space-y-5 rounded-page border border-line bg-white/70 py-6 pr-6 shadow-page">
        {serverError && (
          <p className="rounded-page border border-brick/30 bg-brick/5 px-3.5 py-2.5 text-sm text-brick">
            {serverError}
          </p>
        )}

        <div>
          <label htmlFor="title" className="mb-1.5 block font-body text-sm font-medium text-ink">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className="input-field font-display text-lg"
            value={form.title}
            onChange={handleChange}
            placeholder="Give today a headline"
          />
          {errors.title && <p className="field-error">{errors.title}</p>}
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="mood" className="mb-1.5 block font-body text-sm font-medium text-ink">
              Mood
            </label>
            <select id="mood" name="mood" className="input-field" value={form.mood} onChange={handleChange}>
              {MOODS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.glyph} {m.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="tags" className="mb-1.5 block font-body text-sm font-medium text-ink">
              Tags <span className="text-ink-faint">(comma separated)</span>
            </label>
            <input
              id="tags"
              name="tags"
              type="text"
              className="input-field"
              value={form.tags}
              onChange={handleChange}
              placeholder="gratitude, work, focus"
            />
          </div>
        </div>

        <div>
          <label htmlFor="content" className="mb-1.5 block font-body text-sm font-medium text-ink">
            What's on your mind?
          </label>
          <textarea
            id="content"
            name="content"
            rows={12}
            className="input-field font-journal text-[15px] leading-relaxed"
            value={form.content}
            onChange={handleChange}
            placeholder="Write freely — this page is yours alone."
          />
          <div className="mt-1.5 flex items-center justify-between">
            {errors.content ? (
              <p className="field-error !mt-0">{errors.content}</p>
            ) : (
              <span />
            )}
            <span className="font-mono text-[11px] text-ink-faint">{form.content.length} / 20,000</span>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? 'Saving…' : isEditing ? 'Save changes' : 'Save entry'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
