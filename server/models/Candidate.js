const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  skills: [String],
  resume: String, // path to PDF file
  status: { type: String, default: 'candidate' }, // or 'employee'
});

module.exports = mongoose.model('Candidate', candidateSchema);
