const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
  voucherCode: {
    type: String,
    required: true,
    unique: true
  },
  pinCode: {
    type: String,
    required: true,
    length: 4
  },
  merchantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Merchant',
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  customerName: {
    type: String,
    default: 'Customer'
  },
  customerMobile: {
    type: String,
    default: ''
  },
  rewardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reward',
    required: true
  },
  rewardTitle: {
    type: String,
    required: true
  },
  discountValue: {
    type: Number,
    required: true
  },
  minBillAmount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'REDEEMED', 'EXPIRED'],
    default: 'ACTIVE'
  },
  expiresAt: {
    type: Date,
    required: true
  },
  redeemedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Voucher', voucherSchema);
