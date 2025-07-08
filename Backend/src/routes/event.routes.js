const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const auth = require('../middlewares/auth.middleware');
const subscription = require('../middlewares/subscription.middleware');
const validate = require('../middlewares/validation.middleware');
const { eventSchema } = require('../validators/event.validator');
const checkPoints = require('../middlewares/eventpoint.middleware');

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Event management and booking
 */

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create new event (must be subscribed & have points)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventInput'
 *     responses:
 *       201:
 *         description: Event created
 *       403:
 *         description: Forbidden (Not subscribed / No points)
 *       400:
 *         description: Validation failed
 */
router.post(
  '/',
  auth,
  subscription,
  checkPoints,
  validate(eventSchema),
  eventController.createEvent
);


/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events (not expired) (public)
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: List of all events (not expired)
 */
router.get('/', eventController.getAllEvents);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get a single event by ID (public)
 *     tags: [Events]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Event ID
 *         required: true
 *         schema:
 *           type: string
 *           example: 62a7c9bf1234567890abcdef
 *     responses:
 *       200:
 *         description: Event object
 *       404:
 *         description: Event not found
 */
router.get('/:id', eventController.getEventById);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Update an existing event (must be creator)
 *     tags: [Events]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Event ID
 *         required: true
 *         schema:
 *           type: string
 *           example: 62a7c9bf1234567890abcdef
 *     responses:
 *       200:
 *         description: Event object
 *       404:
 *         description: Event not found
 */
router.put('/:id', auth, eventController.updateEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Delete an existing event (must be creator)
 *     tags: [Events]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Event ID
 *         required: true
 *         schema:
 *           type: string
 *           example: 62a7c9bf1234567890abcdef
 *     responses:
 *       200:
 *         description: Event object
 *       404:
 *         description: Event not found
 */
router.delete('/:id', auth, eventController.deleteEvent);  

/**
 * @swagger
 * /api/events/{id}/tickets:
 *   get:
 *     summary: Get ticket availability for an event
 *     tags: [Events]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Event ID
 *         required: true
 *         schema:
 *           type: string
 *           example: 62a7c9bf1234567890abcdef
 *     responses:
 *       200:
 *         description: Ticket availability information
 *       404:
 *         description: Event not found
 */
router.get('/:id/tickets', eventController.getTicketAvailability);

// Notification routes for events
const notificationController = require('../controllers/notification.controller');

/**
 * @swagger
 * /api/events/{eventId}/notifications:
 *   get:
 *     summary: Get all notifications for an event
 *     tags: [Events]
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
 *     tags: [Events]
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

module.exports = router;
