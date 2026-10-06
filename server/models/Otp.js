const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  identifier: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  otp: {
    type: String,
    required: true,
    trim: true
  },
  purpose: {
    type: String,
    default: 'auth'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // MongoDB TTL index: automatically deletes document at expiresAt
  }
}, { timestamps: true });

module.exports = mongoose.model('Otp', otpSchema);
