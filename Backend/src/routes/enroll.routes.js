const express = require('express');
const router = express.Router();
const enrollController = require('../controllers/enroll.controller');
const auth = require('../middlewares/auth.middleware');
const subscription = require('../middlewares/subscription.middleware');

/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: Manage event enrollments
 */

/**
 * @swagger
 * /api/enrollments/event/{eventId}:
 *   post:
 *     summary: Enroll a user in an event
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the event
 *     responses:
 *       201:
 *         description: Enrollment created
 *       400:
 *         description: Already enrolled or invalid input
 */
router.post('/event/:eventId', auth, subscription, enrollController.enroll);

/**
 * @swagger
 * /api/enrollments/event/{eventId}:
 *   get:
 *     summary: Get all enrollments for a specific event
 *     tags: [Enrollments]
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the event
 *     responses:
 *       200:
 *         description: List of enrollments
 */
router.get('/event/:eventId', auth, enrollController.getEventEnrollments);

/**
 * @swagger
 * /api/enrollments/my:
 *   get:
 *     summary: Get enrollments for a user by userId
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user enrollments
 */
router.get('/my', auth, enrollController.getMyEnrollments);

/**
 * @swagger
 * /api/enrollments/event/{eventId}:
 *   delete:
 *     summary: Cancel an enrollment by event ID
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the event
 *     responses:
 *       200:
 *         description: Enrollment canceled
 *       404:
 *         description: Enrollment not found
 */
router.delete('/event/:eventId', auth, enrollController.cancelEnrollment);

module.exports = router;
