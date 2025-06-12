const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const multer = require('multer');
const path = require('path');

// Setup storage for resumes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  }
});

const upload = multer({ storage });

// Add new candidate
router.post('/', upload.single('resume'), async (req, res) => {
  try {
    const { name, email, phone, skills } = req.body;
    const candidate = new Candidate({
      name,
      email,
      phone,
      skills: skills.split(','), // frontend will send comma-separated string
      resume: req.file.path
    });
    await candidate.save();
    res.status(201).json({ msg: 'Candidate added', candidate });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all candidates (with optional search)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};
    if (search) {
      filter = {
        $or: [
          { name: new RegExp(search, 'i') },
          { email: new RegExp(search, 'i') },
          { skills: { $regex: new RegExp(search, 'i') } },
        ]
      };
    }
    const candidates = await Candidate.find({ ...filter, status: 'candidate' });
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Promote to employee
router.put('/promote/:id', async (req, res) => {
  try {
    const updated = await Candidate.findByIdAndUpdate(
      req.params.id,
      { status: 'employee' },
      { new: true }
    );
    res.json({ msg: 'Candidate promoted', updated });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
