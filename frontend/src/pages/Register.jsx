import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const initialForm = { name: '', email: '', password: '', confirmPassword: '' };

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Name must be at least 2 characters.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (form.password.length < 8) next.password = 'Password must be at least 8 characters.';
    if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      await register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      navigate('/journal');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <h1 className="font-display text-3xl font-semibold text-ink">Create your journal</h1>
      <p className="mt-2 font-body text-sm text-ink-soft">
        Already writing with us?{' '}
        <Link to="/login" className="font-medium text-accent-dark hover:underline">
          Log in
        </Link>
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
        {serverError && (
          <p className="rounded-page border border-brick/30 bg-brick/5 px-3.5 py-2.5 text-sm text-brick">
            {serverError}
          </p>
        )}

        <div>
          <label htmlFor="name" className="mb-1.5 block font-body text-sm font-medium text-ink">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            className="input-field"
            value={form.name}
            onChange={handleChange}
            placeholder="Ishan Pardhi"
          />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block font-body text-sm font-medium text-ink">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className="input-field"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block font-body text-sm font-medium text-ink">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            className="input-field"
            value={form.password}
            onChange={handleChange}
            placeholder="At least 8 characters"
          />
          {errors.password && <p className="field-error">{errors.password}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-1.5 block font-body text-sm font-medium text-ink">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            className="input-field"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? 'Creating your journal…' : 'Create account'}
        </button>
      </form>
    </div>
  );
}
