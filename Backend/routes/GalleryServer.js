const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const gallerySchema = new mongoose.Schema({
  name: String,
  img_url: String,
  description: String,
  category: String
});
const Gallery = mongoose.model('Gallery', gallerySchema);

router.get('/', async (req, res) => {
    try {
      const data = await Gallery.find();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/', async (req, res) => {
    try {
      const { category } = req.query;
      let filter = {};
      if (category) {
        filter.category = category;                                                   
      }
      const images = await Gallery.find(filter);
      res.json(images);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
module.exports = router;