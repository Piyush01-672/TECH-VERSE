const express = require('express');
const mentorController = require('../controllers/MentorController');
const router = express.Router();

router.get('/', mentorController.getMentors);

module.exports = router;
