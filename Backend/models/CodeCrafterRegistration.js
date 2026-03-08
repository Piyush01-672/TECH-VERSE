const mongoose = require("mongoose");

const ParticipantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  gender: { type: String, required: true },
  college: { type: String, required: true },
  program: { type: String, required: true },
});

const CodeCrafterRegistrationSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  hackathonExperience: { type: String, required: false }, // Optional field
  teamSize: { type: Number, required: true },
  contactNumber: { type: String, required: true },
  accommodationRequired: { type: String, required: true, enum: ['Yes', 'No'] },
  accommodationDetails: {
    boysCount: { type: Number, default: 0 },
    girlsCount: { type: Number, default: 0 },
  },
  participants: { type: [ParticipantSchema], required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CodeCrafterRegistration", CodeCrafterRegistrationSchema);
