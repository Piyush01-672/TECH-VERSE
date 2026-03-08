const mongoose = require("mongoose");

const LeaderSchema = new mongoose.Schema(
  {
    name: String,
    img_url: String,
    description: String,
    Designation: String,
    linkedin: String,
    mail: String,
  },
  { collection: "leaders" }
);

module.exports = mongoose.model("Leader", LeaderSchema);
