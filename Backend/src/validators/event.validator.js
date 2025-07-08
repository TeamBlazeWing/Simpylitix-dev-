const Joi = require('joi');

exports.eventSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().allow('', null).optional(),

  type: Joi.string()
    .valid('workshop', 'seminar', 'conference', 'meetup', 'volunteer', 'other')
    .required(),

  date: Joi.date().iso().required(),
  time: Joi.string().required(),
  location: Joi.string().required(),
  district: Joi.string().required(),

  imageUrl: Joi.string().uri().optional(),
  
  tickets: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      price: Joi.number().min(0).required(),
      quantity: Joi.number().min(1).optional(), // For backward compatibility
      totalQuantity: Joi.number().min(1).optional(),
      availableQuantity: Joi.number().min(0).optional(),
      soldQuantity: Joi.number().min(0).optional()
    })
  ).optional(),

  maxAttendees: Joi.number().min(10).optional(),

  tags: Joi.array().items(Joi.string()).optional()
});