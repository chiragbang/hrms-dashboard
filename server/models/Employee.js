const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },           
  email: { type: String, required: true },
  phone: { type: String, required: true },
  department: { type: String, required: true },     
  position: {                                        
    type: String,
    enum: ['Intern', 'Full Time', 'Junior', 'Senior', 'Team Lead'],
    default: 'Full Time',
  },
  dateOfJoining: { type: Date, default: Date.now }, 
  resume: { type: String },                          
  skills: [String],                                  
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
