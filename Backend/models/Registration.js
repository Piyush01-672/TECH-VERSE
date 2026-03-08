const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  regNo: { type: String, required: true },
  contact: { type: String, required: true },
  department: { type: String, required: true },
  Email: { type: String, required: true },
});

const RegistrationSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  teamMembers: { type: Number, required: true },
  members: { type: [MemberSchema], required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Registration", RegistrationSchema);
