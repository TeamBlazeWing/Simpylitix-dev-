const mongoose = require('mongoose');

const earningsSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalRevenue: { type: Number, required: true, default: 0, min: 0 },
  platformFee: { type: Number, required: true, default: 0, min: 0 },
  creatorEarnings: { type: Number, required: true, default: 0, min: 0 },
}, {
  timestamps: true
});

module.exports = mongoose.model('Earnings', earningsSchema);