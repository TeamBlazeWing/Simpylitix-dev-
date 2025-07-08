const Event = require('../models/event.model');
const User = require('../models/user.model');
const Enrollment = require('../models/enrollment.model');

exports.createEnrollment = async (eventId, userId) => {
  const event = await Event.findById(eventId);
  if (!event) throw new Error('Event not found');

  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const existing = await Enrollment.findOne({ eventId, userId });
  if (existing) throw new Error('Already enrolled for this event');

  // Create enrollment
  const enrollment = await Enrollment.create({
    eventId,
    userId,
  });

  return enrollment;
};

exports.getEnrollmentsByEvent = async (eventId) => {
  const event = await Event.findById(eventId);
  if (!event) throw new Error('Event not found');

  // Get all enrollments for the event
  const enrollments = await Enrollment.find({ eventId });
  if (!enrollments || enrollments.length === 0) throw new Error('No enrollments found for this event');

  return enrollments;
};

exports.getMyEnrollments = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  // Get all enrollments for the user
  const enrollments = await Enrollment.find({ userId });
  if (!enrollments || enrollments.length === 0) throw new Error('No enrollments found for this user');

  return enrollments;
};

// Cancel enrollment
exports.cancelEnrollment = async (userId, eventId) => {
  const enrollment = await Enrollment.findOne({ eventId, userId });

  if (!enrollment) {
    throw new Error('Enrollment not found');
  }

  // Delete event
  await Enrollment.findByIdAndDelete(enrollment._id);
};
