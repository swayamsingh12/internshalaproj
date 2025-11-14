const Joi = require('joi');

const signupSchema = Joi.object({
  name: Joi.string().min(20).max(60).required(),
  email: Joi.string().email().required(),
  address: Joi.string().max(400).allow('', null),
  password: Joi.string().min(8).max(16).pattern(new RegExp('(?=.*[A-Z])(?=.*[!@#$%^&*])')).required()
});

module.exports = { signupSchema };
