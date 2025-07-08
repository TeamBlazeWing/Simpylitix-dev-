const Joi = require('joi');

exports.registerSchema = Joi.object({
  name: Joi.string().required(),
  mobileNumber: Joi.string().pattern(/^[0-9]{10}$/).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});
exports.updateProfileSchema = Joi.object({
  name: Joi.string().optional(),
  mobileNumber: Joi.string().pattern(/^[0-9]{10}$/).optional(),
  email: Joi.string().email().optional()
});
