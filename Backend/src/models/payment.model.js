const { ref } = require('joi');
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  paymentType: {
    type: String,
    enum: ['ticket_purchase', 'topup'],
    required: true
  },
  amount: { type: Number, required: true, min: 0 },
  paymentMethod: {
    type: String,
    enum: ['card', 'mobile', 'paypal'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: { type: String, unique: true, sparse: true }, // sparse allows null values
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
