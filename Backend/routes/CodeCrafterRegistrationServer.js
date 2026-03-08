const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const codeCrafterSchema = require('../validations/codeCrafterSchema');
const { registerCodeCrafterTeam } = require('../controllers/CodeCrafterRegistrationController');

// Apply Joi validation middleware before passing to controller
router.post('/', validate(codeCrafterSchema), registerCodeCrafterTeam);

module.exports = router;
