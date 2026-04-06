const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const codeCrafterSchema = require('../validations/codeCrafterSchema'); // Let's reuse or remove schema validation if we need to modify it. Wait, CodeCrafterSchema requires hackathonExperience. Let's create a new roboMechSchema.
const { registerRoboMechTeam } = require('../controllers/RoboMechRegistrationController');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const parseFormData = (req, res, next) => {
  if (req.body.accommodationDetails && typeof req.body.accommodationDetails === 'string') {
    try { req.body.accommodationDetails = JSON.parse(req.body.accommodationDetails); } catch(e){}
  }
  if (req.body.participants && typeof req.body.participants === 'string') {
    try { req.body.participants = JSON.parse(req.body.participants); } catch(e){}
  }
  if (req.body.teamSize) {
    req.body.teamSize = parseInt(req.body.teamSize, 10);
  }
  next();
};

const roboMechSchema = require('../validations/roboMechSchema');

// Apply Joi validation middleware before passing to controller
router.post('/', upload.single('transactionImage'), parseFormData, validate(roboMechSchema), registerRoboMechTeam);

module.exports = router;
