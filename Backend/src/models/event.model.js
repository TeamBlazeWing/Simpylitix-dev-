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
      totalQuantity: { type: Number, required: true, min: 1 },
      availableQuantity: { type: Number, required: true, min: 0 },
      soldQuantity: { type: Number, default: 0, min: 0 },
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

// Pre-save middleware to ensure ticket quantities are properly initialized
eventSchema.pre('save', function(next) {
  if (this.tickets && this.tickets.length > 0) {
    this.tickets.forEach(ticket => {
      // If availableQuantity is not set, set it to totalQuantity
      if (ticket.availableQuantity === undefined) {
        ticket.availableQuantity = ticket.totalQuantity;
      }
      // Ensure soldQuantity is set
      if (ticket.soldQuantity === undefined) {
        ticket.soldQuantity = 0;
      }
      // Validate that soldQuantity + availableQuantity = totalQuantity
      if (ticket.soldQuantity + ticket.availableQuantity !== ticket.totalQuantity) {
        ticket.availableQuantity = ticket.totalQuantity - ticket.soldQuantity;
      }
    });
  }
  next();
});

// Virtual field to get total sold tickets for the event
eventSchema.virtual('totalSoldTickets').get(function() {
  if (!this.tickets || this.tickets.length === 0) return 0;
  return this.tickets.reduce((total, ticket) => total + ticket.soldQuantity, 0);
});

// Virtual field to get total available tickets for the event
eventSchema.virtual('totalAvailableTickets').get(function() {
  if (!this.tickets || this.tickets.length === 0) return 0;
  return this.tickets.reduce((total, ticket) => total + ticket.availableQuantity, 0);
});

// Virtual field to get total tickets for the event
eventSchema.virtual('totalTickets').get(function() {
  if (!this.tickets || this.tickets.length === 0) return 0;
  return this.tickets.reduce((total, ticket) => total + ticket.totalQuantity, 0);
});

// Method to check if event is sold out
eventSchema.methods.isSoldOut = function() {
  return this.totalAvailableTickets === 0;
};

// Method to get ticket by name
eventSchema.methods.getTicketByName = function(ticketName) {
  return this.tickets.find(ticket => ticket.name === ticketName);
};

// Ensure virtuals are included in JSON output
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
