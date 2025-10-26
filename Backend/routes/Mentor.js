const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Same schema as AboutUs
const MentorSchema = new mongoose.Schema({
  name: String,
  img_url: String,
  description: String,
  Designation: String,
  linkedin: String,
  github: String
});

const Mentor = mongoose.model('Mentor', MentorSchema);

// Route to fetch all mentors
router.get('/', async (req, res) => {
  try {
    const data = await Mentor.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
