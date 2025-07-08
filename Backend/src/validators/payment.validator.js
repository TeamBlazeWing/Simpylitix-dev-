const Joi = require('joi');

exports.ticketPaymentSchema = Joi.object({
  tickets: Joi.array().items(
    Joi.object({
      type: Joi.string().required(),
      quantity: Joi.number().integer().min(1).max(10).required(),
      price: Joi.number().min(0).required()
    })
  ).min(1).required(),
  method: Joi.string().valid('card', 'mobile', 'paypal').required(),
});

exports.pointsPaymentSchema = Joi.object({
  pointsAmount: Joi.number().integer().min(10).max(1000).required(),
  method: Joi.string().valid('card', 'mobile', 'paypal').required(),
});
