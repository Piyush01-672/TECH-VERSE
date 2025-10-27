const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const AboutUsSchema = new mongoose.Schema({
  name: String,
  img_url: String,
  description: String,
  Designation: String,
  linkedin: String,
  mail: String
});
const AboutUs = mongoose.model('AboutUs', AboutUsSchema);


router.get('/', async (req, res) => {
    try {
      const data = await AboutUs.find();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

module.exports = router;