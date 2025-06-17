const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    position: String,
    experience: String,
    location: String,
    skills: [String],
    resume: String,
    status: {
      type: String,
      enum: ['New', 'Scheduled', 'Ongoing', 'Selected', 'Rejected'],
      default: 'New',
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model('Candidate', candidateSchema);
