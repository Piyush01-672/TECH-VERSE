const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const codeCrafterSchema = require('../validations/codeCrafterSchema');
const { registerCodeCrafterTeam } = require('../controllers/CodeCrafterRegistrationController');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
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

// Apply Joi validation middleware before passing to controller
router.post('/', upload.single('transactionImage'), parseFormData, validate(codeCrafterSchema), registerCodeCrafterTeam);

module.exports = router;
