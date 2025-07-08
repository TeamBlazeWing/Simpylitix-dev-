const enrollService = require('../services/enroll.service');

exports.enroll = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const eventId = req.params.eventId;
    const enrollment = await enrollService.createEnrollment(eventId, userId);
    res.status(201).json({ 
      message: 'Enrollment successful',
      success: true,
      data: enrollment 
    });
  } catch (err) {
    next(err);
  }
};

exports.getEventEnrollments = async (req, res, next) => {
  try {
    const eventId = req.params.eventId;
    const list = await enrollService.getEnrollmentsByEvent(eventId);
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

exports.getMyEnrollments = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const list = await enrollService.getMyEnrollments(userId);
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

exports.cancelEnrollment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const eventId = req.params.eventId; // Assuming the route is /api/enrollments/event/:eventId
    await enrollService.cancelEnrollment(userId, eventId);
    res.status(200).json({ 
      message: 'Enrollment canceled successfully',
      success: true
    });
  } catch (err) {
    next(err);
  }
};
