const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  merchantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Merchant',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  discountType: {
    type: String,
    enum: ['PERCENTAGE', 'FLAT_AMOUNT', 'FREE_ITEM'],
    default: 'PERCENTAGE'
  },
  discountValue: {
    type: Number,
    required: true
  },
  minBillAmount: {
    type: Number,
    default: 0
  },
  probabilityWeight: {
    type: Number,
    default: 50 // 1 to 100
  },
  validityDays: {
    type: Number,
    default: 7
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Reward', rewardSchema);
