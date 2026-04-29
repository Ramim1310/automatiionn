const express = require('express');
const router = express.Router();
const { parseText, saveStudent } = require('../controllers/studentController');

// POST /api/parse  — Send raw text, get back extracted JSON
router.post('/parse', parseText);

// POST /api/save   — Save parsed student data to MongoDB + Excel
router.post('/save', saveStudent);

module.exports = router;
