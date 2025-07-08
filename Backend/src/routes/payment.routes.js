const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const auth = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const { ticketPaymentSchema, pointsPaymentSchema } = require('../validators/payment.validator');

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Handle payments for tickets and points
 */

/**
 * @swagger
 * /api/payments/tickets/{eventId}:
 *   post:
 *     summary: Buy tickets for an event
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tickets
 *               - method
 *             properties:
 *               tickets:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       example: "VIP"
 *                     quantity:
 *                       type: number
 *                       example: 1
 *                     price:
 *                       type: number
 *                       example: 400
 *               method:
 *                 type: string
 *                 enum: [card, mobile, paypal]
 *                 example: "mobile"
 *     responses:
 *       200:
 *         description: Ticket purchase successful
 *       400:
 *         description: Invalid payment data
 *       401:
 *         description: Unauthorized
 */
router.post('/tickets/:eventId', auth, validate(ticketPaymentSchema), paymentController.buyTickets);

/**
 * @swagger
 * /api/payments/points:
 *   post:
 *     summary: Buy points using various payment methods
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pointsAmount
 *               - method
 *             properties:
 *               pointsAmount:
 *                 type: number
 *                 minimum: 10
 *                 maximum: 1000
 *                 example: 100
 *               method:
 *                 type: string
 *                 enum: [card, mobile, paypal]
 *                 example: "card"
 *     responses:
 *       200:
 *         description: Points purchase successful
 */
router.post('/points', auth, validate(pointsPaymentSchema), paymentController.buyPoints);

/**
 * @swagger
 * /api/payments/history:
 *   get:
 *     summary: Get user payment history
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment history retrieved
 */
router.get('/history', auth, paymentController.getPaymentHistory);

/**
 * @swagger
 * /api/payments/verify/{paymentId}:
 *   post:
 *     summary: Verify payment status
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: paymentId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID to verify
 *     responses:
 *       200:
 *         description: Payment verification result
 */
router.post('/verify/:paymentId', auth, paymentController.verifyPayment);

// Add a debug endpoint before the tickets route
router.post('/debug', auth, (req, res) => {
  console.log('=== Debug Endpoint ===');
  console.log('User:', req.user);
  console.log('Body:', req.body);
  console.log('Headers:', req.headers);
  res.json({ 
    message: 'Debug endpoint working',
    user: req.user,
    body: req.body 
  });
});

module.exports = router;