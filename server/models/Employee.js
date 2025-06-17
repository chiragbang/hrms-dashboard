const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },           // Full Name
  email: { type: String, required: true },
  phone: { type: String, required: true },
  department: { type: String, required: true },     // from candidate.position
  position: {                                        // dropdown in UI
    type: String,
    enum: ['Intern', 'Full Time', 'Junior', 'Senior', 'Team Lead'],
    default: 'Full Time',
  },
  dateOfJoining: { type: Date, default: Date.now }, // join date
  resume: { type: String },                          // optional
  skills: [String],                                  // optional
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
