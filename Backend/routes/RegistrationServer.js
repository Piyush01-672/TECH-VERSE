const express = require("express");
const rateLimit = require('express-rate-limit');
const registrationController = require('../controllers/RegistrationController');
const validate = require('../middlewares/validate');
const { RegistrationValidationSchema } = require('../validations/RegistrationValidation');
const router = express.Router();

// Stricter rate limit for the registration endpoint to prevent spam/DoS
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 registrations per window
  message: { message: "Too many registrations created from this IP, please try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/", registerLimiter, validate(RegistrationValidationSchema), registrationController.registerTeam);
router.get("/csv", registrationController.getRegistrationsCSV);

module.exports = router;
