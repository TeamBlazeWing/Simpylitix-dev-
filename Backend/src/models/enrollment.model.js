const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { 
  timestamps: true
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);