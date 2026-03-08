const Leader = require("../models/Leader");

const getLeaders = async (req, res) => {
  try {
    const leaders = await Leader.find();
    res.json(leaders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getLeaders
};
