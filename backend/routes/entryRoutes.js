const express = require('express');
const protect = require('../middleware/auth');
const {
  getEntries,
  getEntry,
  createEntry,
  updateEntry,
  deleteEntry,
} = require('../controllers/entryController');

const router = express.Router();

// Every route below requires a valid, logged-in user
router.use(protect);

router.route('/').get(getEntries).post(createEntry);
router.route('/:id').get(getEntry).put(updateEntry).delete(deleteEntry);

module.exports = router;
