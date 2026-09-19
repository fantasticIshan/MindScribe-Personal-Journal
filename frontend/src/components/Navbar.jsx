import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-line bg-paper/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link to={user ? '/journal' : '/'} className="flex items-baseline gap-2">
          <span className="font-display text-xl font-semibold tracking-tight text-ink">MindScribe</span>
          <span className="hidden font-mono text-[11px] uppercase tracking-widest text-ink-faint sm:inline">
            private &amp; secure
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/journal" className="font-body text-sm text-ink-soft hover:text-accent-dark">
                My entries
              </Link>
              <Link to="/journal/new" className="btn-primary !py-2 !px-4 text-sm">
                New entry
              </Link>
              <button onClick={handleLogout} className="btn-secondary !py-2 !px-4 text-sm">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="font-body text-sm text-ink-soft hover:text-accent-dark">
                Log in
              </Link>
              <Link to="/register" className="btn-primary !py-2 !px-4 text-sm">
                Start writing
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
