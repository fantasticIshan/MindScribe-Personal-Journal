import axios from 'axios';

// withCredentials lets the browser send/receive the HTTP-only auth cookie.
// baseURL of '/api' relies on the Vite dev proxy (see vite.config.js) in
// development, and on serving the frontend from the same origin as the API
// (or a reverse proxy) in production.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export default api;
