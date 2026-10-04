const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  originalPrice: {
    type: Number,
    default: 0
  },
  period: {
    type: String,
    default: '/ Year'
  },
  subtext: {
    type: String,
    default: ''
  },
  highlightBadge: {
    type: String,
    default: ''
  },
  tagText: {
    type: String,
    default: ''
  },
  trialDays: {
    type: Number,
    default: 2
  },
  scansLimit: {
    type: String,
    default: 'Unlimited customer QR scans'
  },
  features: {
    type: [String],
    default: []
  },
  ctaText: {
    type: String,
    default: 'Start 2-Day Trial'
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  showOnLandingPage: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Plan', planSchema);
