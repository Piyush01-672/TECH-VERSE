const Joi = require('joi');

const MemberSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Member name is required.',
  }),
  regNo: Joi.string().required().messages({
    'string.empty': 'Registration Number is required.',
  }),
  contact: Joi.string().required().messages({
    'string.empty': 'Contact is required.',
  }),
  department: Joi.string().required().messages({
    'string.empty': 'Department is required.',
  }),
  Email: Joi.string().email().required().messages({
    'string.email': 'Member must provide a valid email.',
    'string.empty': 'Member email is required.',
  })
});

const RegistrationValidationSchema = Joi.object({
  teamName: Joi.string().required().messages({
    'string.empty': 'Team Name is required.',
  }),
  teamMembers: Joi.number().integer().min(1).max(10).required().messages({
    'any.required': 'Number of team members is required.',
  }),
  members: Joi.array().items(MemberSchema).min(1).required().messages({
    'array.min': 'At least one member is required.',
    'any.required': 'Members array is required.',
  })
});

module.exports = {
  RegistrationValidationSchema
};
