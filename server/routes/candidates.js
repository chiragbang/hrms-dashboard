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
    const { name, email, phone, skills, position, experience, location } = req.body;
    const candidate = new Candidate({
      name,
      email,
      phone,
      position,
      experience,
      location,
      skills: skills.split(',').map(s => s.trim()), // clean whitespace
      resume: req.file?.path || '',
      status: 'New' // default, can omit this if defined in schema
    });
    await candidate.save();
    res.status(201).json({ msg: 'Candidate added', candidate });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all candidates (with optional search)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};

    if (search) {
      const regex = new RegExp(search, 'i');
      filter = {
        $or: [
          { name: regex },
          { email: regex },
          { skills: { $in: [regex] } },
          { position: regex },
          { location: regex }
        ]
      };
    }

    const candidates = await Candidate.find(filter);
    res.json(candidates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update candidate status (e.g., Scheduled, Ongoing, Selected, Rejected)
router.put('/status/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['New', 'Scheduled', 'Ongoing', 'Selected', 'Rejected'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ msg: 'Invalid status value' });
    }

    const updated = await Candidate.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ msg: `Status updated to ${status}`, updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
