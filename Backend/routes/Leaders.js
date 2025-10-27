const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// ⚙️ Schema (same fields as your collection)
const LeaderSchema = new mongoose.Schema(
  {
    name: String,
    img_url: String,
    description: String,
    Designation: String,
    linkedin: String,
    mail: String,
  },
  { collection: "leaders" } // ✅ important: use existing collection
);

// Model
const Leader = mongoose.model("Leader", LeaderSchema);

// 📍 Get all leaders
router.get("/", async (req, res) => {
  try {
    const leaders = await Leader.find();
    res.json(leaders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
