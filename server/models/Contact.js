const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    default: ''
  },
  message: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['NEW', 'CONTACTED', 'RESOLVED'],
    default: 'NEW'
  },
  notes: {
    type: String,
    default: ''
  },
  ip: {
    type: String,
    default: ''
  },
  source: {
    type: String,
    default: 'LANDING_PAGE'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);
