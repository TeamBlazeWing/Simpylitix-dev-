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
