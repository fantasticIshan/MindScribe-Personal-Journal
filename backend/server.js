require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const entryRoutes = require('./routes/entryRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

connectDB();

// --- Core middleware ---
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true, // allow the HTTP-only auth cookie to be sent
  })
);
app.use(express.json({ limit: '100kb' })); // small limit: this app only ever sends journal text
app.use(cookieParser());

// --- Routes ---
app.get('/api/health', (_req, res) => res.status(200).json({ success: true, status: 'MindScribe API is running' }));
app.use('/api/auth', authRoutes);
app.use('/api/entries', entryRoutes);

// --- 404 fallback for unknown API routes ---
app.use('/api', (_req, res) => {
  res.status(404).json({ success: false, message: 'API route not found.' });
});

// --- Centralized error handler (must be last) ---
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`MindScribe API listening on port ${PORT}`));
