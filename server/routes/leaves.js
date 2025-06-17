const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');
const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

// Add leave for an employee (by HR/Admin)
router.post('/', async (req, res) => {
  try {
    const { employeeId, fromDate, toDate, reason } = req.body;

    const normalizedFrom = new Date(new Date(fromDate).setHours(0, 0, 0, 0));

    const attendance = await Attendance.findOne({
      employeeId,
      date: normalizedFrom,
      status: 'Present',
    });

    if (!attendance) {
      return res
        .status(400)
        .json({ msg: 'Cannot apply leave: Employee was not marked Present on fromDate' });
    }

    const overlappingLeave = await Leave.findOne({
      employeeId,
      $or: [
        { fromDate: { $lte: toDate }, toDate: { $gte: fromDate } },
      ],
    });

    if (overlappingLeave) {
      return res
        .status(400)
        .json({ msg: 'Employee already has a leave during this period' });
    }

    const leave = new Leave({ employeeId, fromDate, toDate, reason });
    await leave.save();

    res.status(201).json({ msg: 'Leave added successfully', leave });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to add leave' });
  }
});

// Get all leaves
router.get('/', async (req, res) => {
  try {
    const { search, date } = req.query;
    let filter = {};

    if (search) {
      const employees = await Employee.find({
        name: { $regex: search, $options: 'i' },
      }).select('_id');
      filter.employeeId = { $in: employees.map((e) => e._id) };
    }

    if (date) {
      filter.fromDate = { $lte: new Date(date) };
      filter.toDate = { $gte: new Date(date) };
    }

    const leaves = await Leave.find(filter).populate('employeeId');
    res.json(leaves);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch leaves' });
  }
});

// Update leave status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Leave.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ msg: `Leave ${status}`, leave: updated });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update leave' });
  }
});

module.exports = router;
