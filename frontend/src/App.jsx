import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import EntryForm from './pages/EntryForm.jsx';
import EntryView from './pages/EntryView.jsx';
import NotFound from './pages/NotFound.jsx';
import Loader from './components/Loader.jsx';

export default function App() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {loading ? (
          <Loader label="Waking MindScribe up…" />
        ) : (
          <Routes>
            <Route path="/" element={user ? <Navigate to="/journal" replace /> : <Landing />} />
            <Route path="/login" element={user ? <Navigate to="/journal" replace /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/journal" replace /> : <Register />} />

            <Route
              path="/journal"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/journal/new"
              element={
                <PrivateRoute>
                  <EntryForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/journal/:id"
              element={
                <PrivateRoute>
                  <EntryView />
                </PrivateRoute>
              }
            />
            <Route
              path="/journal/:id/edit"
              element={
                <PrivateRoute>
                  <EntryForm />
                </PrivateRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        )}
      </main>
    </div>
  );
}
