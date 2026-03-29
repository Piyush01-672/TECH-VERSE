const mongoose = require("mongoose");

const ParticipantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  contactNumber: { type: String, required: true },
  gender: { type: String, required: true },
  college: { type: String, required: true },
  program: { type: String, required: true },
});

const CodeCrafterRegistrationSchema = new mongoose.Schema({
  teamName: { type: String, required: true, unique: true },
  teamSize: { type: Number, required: true },
  selectedEvent: { type: String, required: true },
  selectedTheme: { type: String, required: false },
  transactionId: { type: String, required: true },
  transactionImage: { type: String, required: true },
  accommodationRequired: { type: String, required: true, enum: ['Yes', 'No'] },
  accommodationDetails: {
    boysCount: { type: Number, default: 0 },
    girlsCount: { type: Number, default: 0 },
  },
  participants: { type: [ParticipantSchema], required: true },
  extraGaming: { type: String, default: "None" },
  referralType: { type: String, enum: ['Community', 'Other', ''], default: '' },
  referralCommunityName: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CodeCrafterRegistration", CodeCrafterRegistrationSchema);
