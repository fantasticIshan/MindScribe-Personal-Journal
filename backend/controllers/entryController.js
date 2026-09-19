const Entry = require('../models/Entry');
const { asyncHandler } = require('../middleware/errorHandler');

// @route   GET /api/entries
// @access  Private
// Supports optional query params: ?search=, ?mood=, ?favorite=true, ?page=, ?limit=
const getEntries = asyncHandler(async (req, res) => {
  const { search, mood, favorite, page = 1, limit = 12 } = req.query;

  const filter = { user: req.user._id };
  if (mood) filter.mood = mood;
  if (favorite === 'true') filter.favorite = true;
  if (search) filter.$text = { $search: search };

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 50);

  const [entries, total] = await Promise.all([
    Entry.find(filter)
      .sort({ entryDate: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Entry.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: entries.length,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum) || 1,
    entries,
  });
});

// @route   GET /api/entries/:id
// @access  Private
const getEntry = asyncHandler(async (req, res) => {
  const entry = await Entry.findOne({ _id: req.params.id, user: req.user._id });

  if (!entry) {
    return res.status(404).json({ success: false, message: 'Journal entry not found.' });
  }

  res.status(200).json({ success: true, entry });
});

// @route   POST /api/entries
// @access  Private
const createEntry = asyncHandler(async (req, res) => {
  const { title, content, mood, tags, entryDate, favorite } = req.body;

  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Title and content are required.' });
  }

  const entry = await Entry.create({
    user: req.user._id,
    title,
    content,
    mood,
    tags,
    favorite,
    entryDate,
  });

  res.status(201).json({ success: true, entry });
});

// @route   PUT /api/entries/:id
// @access  Private
const updateEntry = asyncHandler(async (req, res) => {
  const entry = await Entry.findOne({ _id: req.params.id, user: req.user._id });

  if (!entry) {
    return res.status(404).json({ success: false, message: 'Journal entry not found.' });
  }

  const { title, content, mood, tags, entryDate, favorite } = req.body;

  if (title !== undefined) entry.title = title;
  if (content !== undefined) entry.content = content;
  if (mood !== undefined) entry.mood = mood;
  if (tags !== undefined) entry.tags = tags;
  if (entryDate !== undefined) entry.entryDate = entryDate;
  if (favorite !== undefined) entry.favorite = favorite;

  await entry.save(); // runs schema validators on update too

  res.status(200).json({ success: true, entry });
});

// @route   DELETE /api/entries/:id
// @access  Private
const deleteEntry = asyncHandler(async (req, res) => {
  const entry = await Entry.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!entry) {
    return res.status(404).json({ success: false, message: 'Journal entry not found.' });
  }

  res.status(200).json({ success: true, message: 'Journal entry deleted.' });
});

module.exports = { getEntries, getEntry, createEntry, updateEntry, deleteEntry };
