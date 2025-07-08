// src/config/swagger.config.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SimplyTix Event Booking API',
      version: '1.0.0',
      description: 'API documentation for SimplyTix event management system',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'password', 'mobileNumber'],
          properties: {
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            password: { type: 'string', example: 'secret123' },
            mobileNumber: { type: 'string', example: '94771234567' },
          },
        },
        Login: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'john@example.com' },
            password: { type: 'string', example: 'secret123' },
          },
        },
        EnrollmentInput: {
          type: 'object',
          required: ['eventId', 'mobileNumber', 'quantity'],
          properties: {
            eventId: { type: 'string', example: '60f9c29c9b1d8e001c8f0d91' },
            mobileNumber: { type: 'string', example: '94771234567' },
            quantity: { type: 'integer', example: 2 }
          }
        },
        EventInput: {
          type: 'object',
          required: ['title', 'type', 'date', 'time', 'location', 'district'],
          properties: {
            title: { type: 'string', example: 'Tech Innovation Workshop' },
            description: { type: 'string', example: 'Hands-on session exploring future tech.' },
            type: {
              type: 'string',
              enum: ['workshop', 'seminar', 'conference', 'meetup', 'volunteer', 'other'],
              example: 'workshop',
            },
            date: { type: 'string', format: 'date-time', example: '2025-08-10T16:00:00Z' },
            time: { type: 'string', example: '16:00' },
            location: { type: 'string', example: 'University of Moratuwa, Hall B' },
            district: { type: 'string', example: 'Colombo' },
            imageUrl: { type: 'string', example: 'https://cdn.app/images/tech-event.png' },
            tickets: {
              type: 'array',
              items: {
                type: 'object',
                required: ['name', 'price'],
                properties: {
                  name: { type: 'string', example: 'General' },
                  price: { type: 'number', example: 1000 }
                }
              },
              example: [
                { name: 'General', price: 1000 },
                { name: 'Student', price: 500 },
                { name: 'VIP', price: 2000 }
              ]
            },
            maxAttendees: { type: 'number', example: 200 },
            tags: {
              type: 'array',
              items: { type: 'string' },
              example: ['technology', 'workshop', 'students'],
            },
          },
        }
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;