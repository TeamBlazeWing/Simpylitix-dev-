const mongoose = require('mongoose');

const generateEventId = () => {
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `EVT${random}`;
};

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  eventCode: { 
    type: String, 
    unique: true,
    default: generateEventId
  },
  type: {
    type: String,
    enum: ['workshop', 'seminar', 'conference', 'meetup', 'volunteer', 'other'],
    required: true
  },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  district: { type: String, required: true },
  imageUrl: String,
  tickets: [
    {
      name: { type: String, required: true },   // "General", "VIP", "Free"
      price: { type: Number, required: true, min: 0 },
    }
  ],
  maxAttendees: {
    type: Number,
    default: 100,
    min: 10
  },
  attendees: {
    type: Number,
    default: 0,
    min: 0,
    validate: {
      validator: function (v) {
        return v <= this.maxAttendees;
      },
      message: 'Attendees cannot exceed max attendees'
    }
  },
  tags: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Event', eventSchema);
