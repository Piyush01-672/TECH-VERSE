const mongoose = require('mongoose');

const MentorSchema = new mongoose.Schema({
  name: String,
  img_url: String,
  description: String,
  Designation: String,
  linkedin: String,
  mail: String
});

module.exports = mongoose.model('Mentor', MentorSchema);
