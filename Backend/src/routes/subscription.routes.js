const express = require('express');
const router = express.Router();
const controller = require('../controllers/subscription.controller');

/**
 * @swagger
 * tags:
 *   name: Subscription
 *   description: mSpace subscription operations
 */

/**
 * @swagger
 * /api/subscription/otp-request:
 *   post:
 *     summary: Request OTP for subscription
 *     tags: [Subscription]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobileNumber:
 *                 type: string
 *                 example: "94712345678"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 referenceNo:
 *                   type: string
 *       400:
 *         description: Invalid request or failure
 */
router.post('/otp-request', controller.otpRequest);

/**
 * @swagger
 * /api/subscription/otp-verify:
 *   post:
 *     summary: Verify OTP and activate subscription
 *     tags: [Subscription]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               referenceNo:
 *                 type: string
 *               otp:
 *                 type: string
 *               mobileNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Subscription verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subscriptionStatus:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: OTP verification failed
 */
router.post('/otp-verify', controller.otpVerify);

/**
 * @swagger
 * /api/subscription/get-status:
 *   post:
 *     summary: Get current subscription status from mSpace
 *     tags: [Subscription]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               maskedMobile:
 *                 type: string
 *                 example: "tel:maskedNumberHere"
 *     responses:
 *       200:
 *         description: Subscription status returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subscriptionStatus:
 *                   type: string
 *       400:
 *         description: Failed to get subscription status
 */
router.post('/get-status', controller.getStatus);

/**
 * @swagger
 * /api/subscription/unsubscribe:
 *   post:
 *     summary: Unsubscribe user from mSpace
 *     tags: [Subscription]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               maskedMobile:
 *                 type: string
 *                 example: "tel:maskedNumberHere"
 *     responses:
 *       200:
 *         description: Unsubscription successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subscriptionStatus:
 *                   type: string
 *       400:
 *         description: Unsubscription failed
 */
router.post('/unsubscribe', controller.unsubscribe);

module.exports = router;
