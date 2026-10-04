const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  userId: {
    type: String,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  mobile: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    default: 'Password@123'
  },
  district: {
    type: String,
    default: '—'
  },
  state: {
    type: String,
    default: '—'
  },
  mwId: {
    type: String,
    default: '—'
  },
  totalMwCreated: {
    type: Number,
    default: 0
  },
  totalSales: {
    type: String,
    default: '0'
  },
  hasReferral: {
    type: Boolean,
    default: true
  },
  hasCustomerTracker: {
    type: Boolean,
    default: true
  },
  referralCode: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['SUPER_ADMIN', 'OPS_MANAGER', 'SUPPORT_LEAD', 'FIELD_AGENT'],
    default: 'FIELD_AGENT'
  },
  permissions: {
    type: [String],
    default: ['VIEW_MERCHANTS', 'VIEW_CUSTOMERS']
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'SUSPENDED', 'INACTIVE'],
    default: 'ACTIVE'
  },
  lastLogin: {
    type: String,
    default: 'Never'
  }
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
