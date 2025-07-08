const eventService = require('../services/event.service');

exports.createEvent = async (req, res, next) => {
  try {
    const eventData = {
      ...req.body,
      createdBy: req.user.id
    };

    // Ensure tickets have proper quantity structure
    if (eventData.tickets && eventData.tickets.length > 0) {
      eventData.tickets = eventData.tickets.map(ticket => ({
        ...ticket,
        totalQuantity: ticket.totalQuantity || ticket.quantity || 1,
        availableQuantity: ticket.availableQuantity || ticket.quantity || 1,
        soldQuantity: ticket.soldQuantity || 0
      }));
    }

    const event = await eventService.createEvent(eventData);

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    next(error);
  }
};


exports.getAllEvents = async (req, res, next) => {
  try {
    const events = await eventService.getAllEvents();
    res.status(200).json({
      success: true,
      message: 'Events retrieved successfully',
      data: events
    });
  } catch (error) {
    next(error);
  }
};

exports.getEventById = async (req, res, next) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Event retrieved successfully',
      data: event
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    await eventService.deleteEvent(req.params.id, req.user.id);
    
    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const updatedEvent = await eventService.updateEvent(req.params.id, req.body, req.user.id);
    
     res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent
    });
  } catch (error) {
    next(error);
  }
};


// Get all events created by a specific user
exports.getEventsByUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const events = await Event.find({ createdBy: userId }).sort({ createdAt: -1 });

    if (!events.length) {
      return res.status(404).json({ message: 'No events found for this user' });
    }

    res.status(200).json({ message: 'Events retrieved successfully', events });
  } catch (error) {
    next(error);
  }
};

// Get ticket availability for an event
exports.getTicketAvailability = async (req, res, next) => {
  try {
    const availability = await eventService.getTicketAvailability(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Ticket availability retrieved successfully',
      data: availability
    });
  } catch (error) {
    next(error);
  }
};


