const Event = require('../models/event.model');
const User = require('../models/user.model');

exports.createEvent = async (eventData) => {
  // Validate user exists
  const user = await User.findById(eventData.createdBy);
  if (!user) {
    throw new Error('User not found');
  }

  // Create and return event
  const event = await Event.create(eventData);
  user.points -= 10; // Deduct points for creating an event
  await user.save();
  return await event.populate('createdBy', 'name email');
};

exports.getAllEvents = async () => {
  const currentDate = new Date();
  
  return await Event.find({
    date: { $gte: currentDate }
  })
  .populate('createdBy', 'name email')
  .sort({ date: 1 });
};

exports.getEventById = async (id) => {
  const event = await Event.findById(id).populate('createdBy', 'name email');
  
  if (!event) {
    throw new Error('Event not found');
  }
  
  return event;
};

exports.deleteEvent = async (id, userId) => {
  const event = await Event.findById(id);
  
  if (!event) {
    throw new Error('Event not found');
  }

  // Check authorization
  if (event.createdBy.toString() !== userId) {
    throw new Error('Unauthorized to delete this event');
  }

  // Delete event
  await Event.findByIdAndDelete(id);
};

exports.updateEvent = async (id, updateData, userId) => {
  const event = await Event.findById(id);
  
  if (!event) {
    throw new Error('Event not found');
  }

  // Check authorization
  if (event.createdBy.toString() !== userId) {
    throw new Error('Unauthorized to update this event');
  }

  // Update and return
  Object.assign(event, updateData);
  await event.save();
  
  return await event.populate('createdBy', 'name email');
};

exports.updateTicketQuantities = async (eventId, ticketPurchases) => {
  const event = await Event.findById(eventId);
  
  if (!event) {
    throw new Error('Event not found');
  }

  // Update ticket quantities
  for (const purchase of ticketPurchases) {
    // Try to find the ticket by name OR type
    const ticket = event.tickets.find(t => 
      t.name === purchase.ticketName || t.type === purchase.ticketName
    );
    
    if (!ticket) {
      throw new Error(`Ticket type "${purchase.ticketName}" not found`);
    }

    if (ticket.availableQuantity < purchase.quantity) {
      throw new Error(`Insufficient tickets available for "${purchase.ticketName}"`);
    }

    ticket.availableQuantity -= purchase.quantity;
    ticket.soldQuantity += purchase.quantity;
  }

  await event.save();
  return event;
};

exports.validateTicketAvailability = async (eventId, ticketPurchases) => {
  const event = await Event.findById(eventId);
  
  if (!event) {
    throw new Error('Event not found');
  }

  for (const purchase of ticketPurchases) {
    // Try to find the ticket by name OR type
    const ticket = event.tickets.find(t => 
      t.name === purchase.ticketName || t.type === purchase.ticketName
    );
    
    if (!ticket) {
      throw new Error(`Ticket type "${purchase.ticketName}" not found`);
    }

    if (ticket.availableQuantity < purchase.quantity) {
      throw new Error(`Only ${ticket.availableQuantity} tickets available for "${purchase.ticketName}"`);
    }
  }

  return true;
};

exports.getTicketAvailability = async (eventId) => {
  const event = await Event.findById(eventId);
  
  if (!event) {
    throw new Error('Event not found');
  }

  return {
    eventId: event._id,
    eventTitle: event.title,
    tickets: event.tickets.map(ticket => ({
      name: ticket.name,
      price: ticket.price,
      totalQuantity: ticket.totalQuantity,
      availableQuantity: ticket.availableQuantity,
      soldQuantity: ticket.soldQuantity,
      percentageSold: ((ticket.soldQuantity / ticket.totalQuantity) * 100).toFixed(1)
    })),
    totalSoldTickets: event.totalSoldTickets,
    totalAvailableTickets: event.totalAvailableTickets,
    isSoldOut: event.isSoldOut()
  };
};
