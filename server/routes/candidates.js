const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const Employee = require('../models/Employee'); 
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  }
});

const upload = multer({ storage });


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
      skills: skills.split(',').map(s => s.trim()),
      resume: req.file?.path || '',
    });

    await candidate.save();
    res.status(201).json({ msg: 'Candidate added successfully', candidate });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});


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

    const candidates = await Candidate.find(filter).sort({ updatedAt: -1 });
    res.json(candidates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.put('/status/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['New', 'Scheduled', 'Ongoing', 'Selected', 'Rejected'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ msg: 'Invalid status value' });
    }

    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!candidate) {
      return res.status(404).json({ msg: 'Candidate not found' });
    }

    
    if (status === 'Selected') {
      const exists = await Employee.findOne({ email: candidate.email });

      if (!exists) {
        const employee = new Employee({
          name: candidate.name,
          email: candidate.email,
          phone: candidate.phone,
          department: candidate.position, 
          position: 'Full Time', 
          dateOfJoining: new Date(),
          resume: candidate.resume,
          skills: candidate.skills
        });

        await employee.save();
      }
    }

    res.json({ msg: `Status updated to ${status}`, updated: candidate });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) {
      return res.status(404).json({ msg: 'Candidate not found' });
    }

    if (candidate.resume && fs.existsSync(candidate.resume)) {
      fs.unlinkSync(candidate.resume);
    }

    res.json({ msg: 'Candidate deleted successfully', candidate });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
