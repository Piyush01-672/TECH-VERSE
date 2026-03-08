const express = require('express');
const galleryController = require('../controllers/GalleryController');
const router = express.Router();

router.get('/', galleryController.getGalleryImages);

module.exports = router;