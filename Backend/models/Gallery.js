const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  name: String,
  img_url: String,
  description: String,
  category: String
});

module.exports = mongoose.model('Gallery', gallerySchema);
