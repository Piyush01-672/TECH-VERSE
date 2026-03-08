const Joi = require('joi');

const ContactValidationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  mobile: Joi.string().pattern(/^[0-9]{10}$/).required(),
  subject: Joi.string().required(),
  message: Joi.string().required()
});

module.exports = {
  ContactValidationSchema
};
