const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const auth = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Event notifications management
 */

/**
 * @swagger
 * /api/events/{eventId}/notifications:
 *   get:
 *     summary: Get all notifications for an event
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: The event ID
 *     responses:
 *       200:
 *         description: List of notifications
 *       404:
 *         description: Event not found
 */
router.get('/:eventId/notifications', notificationController.getEventNotifications);

/**
 * @swagger
 * /api/events/{eventId}/notifications:
 *   post:
 *     summary: Create a new notification for an event
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: The event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - message
 *             properties:
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [info, update, alert, reminder]
 *                 default: info
 *     responses:
 *       201:
 *         description: Notification created
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Event not found
 */
router.post('/:eventId/notifications', auth, notificationController.createNotification);

/**
 * @swagger
 * /api/notifications/{notificationId}:
 *   delete:
 *     summary: Delete a notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The notification ID
 *     responses:
 *       200:
 *         description: Notification deleted
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Notification not found
 */
router.delete('/notifications/:notificationId', auth, notificationController.deleteNotification);

// Fetch user's notifications
router.get('/my', auth, notificationController.getUserNotifications);

// Mark a single notification as read
router.put('/:notificationId/read', auth, notificationController.markAsRead);

module.exports = router;
