const AboutUs = require('../models/AboutUs');

const getAboutUsData = async (req, res) => {
  try {
    const data = await AboutUs.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAboutUsData
};
