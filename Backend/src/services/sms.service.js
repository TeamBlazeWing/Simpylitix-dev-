// const axios = require('axios');
// const Event = require('../models/event.model');
// const Registration = require('../models/registration.model');
// const User = require('../models/user.model');
// const eventService = require('./event.service');

// const API_BASE_URL = process.env.SMS_API_BASE_URL || 'https://api.mspace.lk';
// const API_APP_ID = process.env.API_APP_ID || 'APP_009067';
// const API_PASSWORD = process.env.API_PASSWORD || '8bfef8c12e26f35175131674da2d725c';
// const API_VERSION = process.env.API_VERSION || '1.0';

// class SMSService {
//   /**
//    * Send SMS to mobile numbers
//    */
//   async sendSMS(mobileNumbers, message) {
//     try {
//       const payload = {
//         version: API_VERSION,
//         applicationId: API_APP_ID,
//         password: API_PASSWORD, 
//         message: message,
//         destinationAddresses: ['tel:' + mobileNumbers.join(',tel:')],
//       };

//       console.log(payload);

//       const response = await axios.post(`${API_BASE_URL}/sms/send`, payload);

//       console.log('Response:', response.data);
//       return response.data;
//     } catch (error) {
//       console.error('SMS sending failed:', error.message);
//       throw new Error('Failed to send SMS notification');
//     }
//   }

//   /**
//    * Send event registration confirmation
//    */
//   async sendRegistrationConfirmation(mobileNumber, eventData, registrationData) {
//     console.log(eventData);
//     console.log(registrationData);
//     const message = `
//       Registration confirmed! You're registered for "${eventData.title}".
//       Date: ${eventData.date}
//       Time: ${eventData.time}
//       Location: ${eventData.location}
//       ${eventData.isFree ? 'This is a free event.' : `Payment Amount: ${registrationData.paymentAmount}`}
//       Your registration ID is: ${registrationData.registrationId}.
//       Please keep this message for your records.
//       `;

//       // ! DEBUGGING
//       console.log(`📱 Sending registration confirmation to ${mobileNumber}: ${message}`);
//     return await this.sendSMS([mobileNumber], message);
//   }

//   /**
//    * Send event reminder
//    */
//   async sendEventReminder(mobileNumbers, eventTitle, eventDate) {
//     const message = `Reminder: Your event "${eventTitle}" is on ${eventDate}. See you there!`;
//     return await this.sendSMS(mobileNumbers, message);
//   }

//   /**
//    * Send event updates
//    */
//   async sendEventUpdate(eventId, userId, updateMessage) {
//     const event = await Event.findOne({ eventId: eventId });

//     console.log(userId)
//     ;
//     if (event.createdBy.toString() !== userId.toString()) {
//       console.error(`User ${userId} is not authorized to send updates for event ${eventId}`);
//       throw new Error('Unauthorized to send updates for this event');
//     }

//     if (!event) {
//       console.error(`Event with ID ${eventId} not found`);
//       throw new Error('Event not found');
//     }

//     const mobileNumbers = await Registration.find({ eventId: eventId }).distinct('mobileNumber');
    
//     if (mobileNumbers.length === 0) {
//       console.warn(`No registrations found for event ${eventId}`);
//       throw new Error('No registrations found for this event');
//     }

//     // ! DEBUGGING
//     console.log(`📱 Sending update to ${mobileNumbers} message: ${updateMessage}`);
    
//     return await this.sendSMS(mobileNumbers, updateMessage);
//   }

//   /**
//    * Send OTP for verification
//    */
//   async sendOTP(mobileNumber, otp) {
//     const message = `Your SimplyTix verification code is: ${otp}. Valid for 5 minutes.`;
//     return await this.sendSMS([mobileNumber], message);
//   }

//   /**
//    * Process incoming SMS messages
//    */
//   async processIncomingSMS(from, message) {
//     const normalizedMessage = message.trim().toUpperCase();
    
//     // Handle BUY command: "REG EVENT_123 2"
//     if (normalizedMessage.startsWith('REG ')) {
//       return await this.handleRegCommand(from, normalizedMessage);
//     }
     
//     // Handle general queries
//     return await this.handleGeneralQuery(from, normalizedMessage);
//   }

//   async handleRegCommand(mobileNumber, message) {
//     try {
//       // Parse: "REG EVT24122 2" -> event: EVT24122, quantity: 2
//       const parts = message.split(' ');
      
//       const eventId = parts[1];
//       const quantity = parseInt(parts[2]);
      
//       const event = await Event.findOne({ eventId: eventId });
//       if (!event) {
//         console.error(`Event with ID ${eventId} not found`);
//         throw new Error('Event not found');
//       }

//       // Process registration
//       const result = await eventService.registerToEventViaSMS(mobileNumber, eventId, quantity);
      
//       await this.sendRegistrationConfirmation(mobileNumber, result.eventData, result.registrationData);
      
//     } catch (error) {
//       console.error('Registration failed:', error.message);
//       await this.sendSMS([mobileNumber], 'Registration failed. Please try again or contact support.');
//     }
//   }

//   async handleGeneralQuery(mobileNumber, message) {
//     await this.sendSMS([mobileNumber], 'For event info, visit our website. For tickets, text: BUY EVENT_ID QUANTITY');
//   }
// }

// module.exports = new SMSService();