const Gallery = require('../models/Gallery');

const getGalleryImages = async (req, res) => {
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
};

module.exports = {
  getGalleryImages
};
