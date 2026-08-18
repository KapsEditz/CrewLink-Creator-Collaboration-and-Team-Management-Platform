const mongoose = require('mongoose');

const freelancerSchema = new mongoose.Schema({
  name: String,
  role: String,
  rate: String,
  status: String,
  rating: Number,
  skills: [String],
  requestState: { type: String, default: 'idle' }
});

module.exports = mongoose.model('Freelancer', freelancerSchema);