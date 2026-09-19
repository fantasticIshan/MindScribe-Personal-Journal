const mongoose = require('mongoose');

const MOODS = ['happy', 'calm', 'neutral', 'sad', 'anxious', 'excited', 'grateful', 'tired'];

const entrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    content: {
      type: String,
      required: [true, 'Journal content cannot be empty'],
      maxlength: [20000, 'Entry cannot exceed 20,000 characters'],
    },
    mood: {
      type: String,
      enum: { values: MOODS, message: '{VALUE} is not a supported mood' },
      default: 'neutral',
    },
    tags: {
      type: [String],
      default: [],
      set: (tags) =>
        Array.isArray(tags)
          ? [...new Set(tags.map((t) => t.trim().toLowerCase()).filter(Boolean))].slice(0, 10)
          : [],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    entryDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Most-recent-first is the natural reading order for a journal
entrySchema.index({ user: 1, entryDate: -1 });

// Lightweight text index to support the search bar
entrySchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Entry', entrySchema);
module.exports.MOODS = MOODS;
