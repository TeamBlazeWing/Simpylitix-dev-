const express = require('express');
const cors = require('cors');
const app = express();

// CORS configuration
const corsOptions = {
  origin: '*',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));

const errorHandler = require('./middlewares/error.middleware');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger.config');

//Routers for all services
const userRoutes = require('./routes/user.routes');
const paymentRoutes = require('./routes/payment.routes');
const eventRoutes = require('./routes/event.routes');
const smsRoutes = require('./routes/sms.routes');
const subscriptionRoutes = require('./routes/subscription.routes');
const enrollmentRoutes = require('./routes/enroll.routes');
const ticketRoutes = require('./routes/ticket.routes');

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes); 

app.use('/api/sms', smsRoutes);

app.use('/api/subscription', subscriptionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/enrollments',enrollmentRoutes );
app.use('/api/tickets', ticketRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(errorHandler);

module.exports = app;
