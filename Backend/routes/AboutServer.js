const express = require('express');
const aboutUsController = require('../controllers/AboutUsController');
const router = express.Router();

router.get('/', aboutUsController.getAboutUsData);

module.exports = router;