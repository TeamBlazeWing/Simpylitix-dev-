const Notification = require('../models/notification.model');
const Event = require('../models/event.model');
const ApiError = require('../utils/ApiError');

// Get all notifications for a user
exports.getUserNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Get all notifications related to events the user has created or enrolled in
    const notifications = await Notification.find({
      $or: [
        { eventId: { $in: req.user.enrolledEvents || [] } },
        { createdBy: userId }
      ]
    })
    .sort({ createdAt: -1 })
    .populate('eventId', 'title imageUrl')
    .populate('createdBy', 'name email')
    .exec();
    
    return res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;
    
    // Find the notification
    const notification = await Notification.findById(notificationId);
    
    if (!notification) {
      return next(new ApiError(404, 'Notification not found'));
    }
    
    // Update notification read status in user's preferences
    // This approach doesn't modify the notification itself but tracks read status per user
    // Implementation depends on how you're tracking read status

    // Example implementation using a simple approach (modifying the notification)
    notification.read = true;
    await notification.save();
    
    return res.status(200).json({
      message: 'Notification marked as read'
    });
  } catch (error) {
    next(error);
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Get all notifications related to events the user has created or enrolled in
    const userNotifications = await Notification.find({
      $or: [
        { eventId: { $in: req.user.enrolledEvents || [] } },
        { createdBy: userId }
      ]
    });
    
    // Mark all as read
    await Promise.all(userNotifications.map(async (notification) => {
      notification.isRead = true;
      return notification.save();
    }));
    
    return res.status(200).json({
      message: 'All notifications marked as read',
      count: userNotifications.length
    });
  } catch (error) {
    next(error);
  }
};

// Get all notifications for an event
exports.getEventNotifications = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    
    // Check if event exists
    const eventExists = await Event.exists({ _id: eventId });
    if (!eventExists) {
      return next(new ApiError(404, 'Event not found'));
    }
    
    const notifications = await Notification.find({ eventId })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email')
      .exec();
    
    return res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

// Create a new notification for an event
exports.createNotification = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { title, message, type } = req.body;
    const createdBy = req.user.id;
    
    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return next(new ApiError(404, 'Event not found'));
    }
    
    // Check if user is the event creator or has admin rights
    if (event.createdBy.toString() !== createdBy && req.user.role !== 'admin') {
      return next(new ApiError(403, 'You are not authorized to create notifications for this event'));
    }
    
    const notification = new Notification({
      eventId,
      title,
      message,
      type,
      createdBy
    });
    
    await notification.save();
    
    return res.status(201).json({
      message: 'Notification created successfully',
      notification
    });
  } catch (error) {
    next(error);
  }
};

// Delete a notification
exports.deleteNotification = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findById(notificationId);
    
    if (!notification) {
      return next(new ApiError(404, 'Notification not found'));
    }
    
    // Check if user is the notification creator or has admin rights
    if (notification.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ApiError(403, 'You are not authorized to delete this notification'));
    }
    
    await Notification.findByIdAndDelete(notificationId);
    
    return res.status(200).json({
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
