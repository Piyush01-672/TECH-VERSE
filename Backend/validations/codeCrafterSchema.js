const Joi = require('joi');

const participantSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Participant name is required.',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Participant must provide a valid email.',
    'string.empty': 'Participant email is required.',
  }),
  gender: Joi.string().valid('Male', 'Female', 'Other').required().messages({
    'any.only': 'Gender must be Male, Female, or Other.',
  }),
  college: Joi.string().required().messages({
    'string.empty': 'College name is required.',
  }),
  program: Joi.string().required().messages({
    'string.empty': 'Program name is required.',
  }),
});

const codeCrafterRegistrationSchema = Joi.object({
  teamName: Joi.string().required().messages({
    'string.empty': 'Team Name is required.',
  }),
  hackathonExperience: Joi.string().allow('').optional(),
  teamSize: Joi.number().integer().min(2).max(5).required().messages({
    'number.min': 'Team size must be at least 2.',
    'number.max': 'Team size cannot exceed 5.',
    'any.required': 'Team size is required.',
  }),
  contactNumber: Joi.string().pattern(/^\d{10}$/).optional().messages({
    'string.pattern.base': 'Contact Number must be a valid 10-digit number.',
  }),
  selectedEvent: Joi.string().valid('Robo Mec 2.0', 'Code Crafter 3.0 (Hackathon)').required().messages({
    'any.only': 'Please select a valid event.',
    'any.required': 'Event selection is required.',
  }),
  selectedTheme: Joi.string().when('selectedEvent', {
    is: 'Code Crafter 3.0 (Hackathon)',
    then: Joi.string().valid('FinTech', 'Agri tech', 'HealthTech', 'Open Innovation').required(),
    otherwise: Joi.string().allow('').optional()
  }).messages({
    'any.only': 'Please select a valid theme.',
    'any.required': 'Theme selection is required for the hackathon.',
  }),
  transactionId: Joi.string().required().messages({
    'string.empty': 'Transaction ID is required.',
  }),
  accommodationRequired: Joi.string().valid('Yes', 'No').required().messages({
    'any.only': 'Accommodation Required must be Yes or No.',
  }),
  accommodationDetails: Joi.object({
    boysCount: Joi.number().integer().min(0).optional(),
    girlsCount: Joi.number().integer().min(0).optional(),
  }).optional(),
  participants: Joi.array()
    .items(participantSchema)
    .min(Joi.ref('teamSize'))
    .max(Joi.ref('teamSize'))
    .required()
    .messages({
      'array.min': 'Number of participants must match the team size.',
      'array.max': 'Number of participants must match the team size.',
      'any.required': 'Participants are required.'
    }),
});

module.exports = codeCrafterRegistrationSchema;
