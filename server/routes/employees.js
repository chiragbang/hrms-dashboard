const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

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
          { phone: regex },
          { department: regex },
          { position: regex },
        ]
      };
    }

    const employees = await Employee.find(filter).sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});



router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone, department, position, dateOfJoining } = req.body;

    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        phone,
        department,
        position,
        dateOfJoining,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ msg: 'Employee not found' });
    }

    res.json({ msg: 'Employee updated successfully', updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});


 
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ msg: 'Employee not found' });
    }

    res.json({ msg: 'Employee deleted successfully', deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});


module.exports = router;
