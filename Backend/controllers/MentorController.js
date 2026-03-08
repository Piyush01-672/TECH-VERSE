const Mentor = require('../models/Mentor');

const getMentors = async (req, res) => {
  try {
    const data = await Mentor.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getMentors
};
