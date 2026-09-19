import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Please enter both your email and password.');
      return;
    }

    setSubmitting(true);
    try {
      await login(form);
      const redirectTo = location.state?.from?.pathname || '/journal';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to log in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <h1 className="font-display text-3xl font-semibold text-ink">Welcome back</h1>
      <p className="mt-2 font-body text-sm text-ink-soft">
        New to MindScribe?{' '}
        <Link to="/register" className="font-medium text-accent-dark hover:underline">
          Create an account
        </Link>
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
        {error && (
          <p className="rounded-page border border-brick/30 bg-brick/5 px-3.5 py-2.5 text-sm text-brick">{error}</p>
        )}

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
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block font-body text-sm font-medium text-ink">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            className="input-field"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
          />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>
    </div>
  );
}
