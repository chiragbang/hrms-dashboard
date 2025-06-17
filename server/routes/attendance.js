const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

// Helper to normalize date (00:00:00 time)
const normalizeDate = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

// GET attendance with optional filters
router.get('/', async (req, res) => {
  try {
    const { search, date } = req.query;
    let filter = {};

    if (search) {
      const employees = await Employee.find({
        name: { $regex: search, $options: 'i' },
      }).select('_id');

      filter.employeeId = { $in: employees.map(emp => emp._id) };
    }

    if (date) {
      filter.date = normalizeDate(date); // 👈 Fix exact date match
    }

    const records = await Attendance.find(filter).populate('employeeId');
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch attendance' });
  }
});

// POST mark/update attendance
router.post('/', async (req, res) => {
  try {
    const { employeeId, date, status } = req.body;

    const normalizedDate = normalizeDate(date);

    const existing = await Attendance.findOneAndUpdate(
      { employeeId, date: normalizedDate },
      { employeeId, date: normalizedDate, status },
      { upsert: true, new: true }
    );

    res.status(200).json({ msg: 'Attendance recorded', attendance: existing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to save attendance' });
  }
});

module.exports = router;
