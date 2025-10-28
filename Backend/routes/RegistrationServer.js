const express = require("express");
const mongoose = require("mongoose");
const { Parser } = require("json2csv");
const router = express.Router();

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

const Registration = mongoose.model("Registration", RegistrationSchema);
router.post("/", async (req, res) => {
  try {
    const registration = new Registration(req.body);
    await registration.save();
    res.status(201).json({ message: "Team registered successfully!" });
  } catch (error) {
    console.error("Error saving registration:", error);
    res.status(500).json({ message: "Error submitting form", error });
  }
});

router.get("/csv", async (req, res) => {
  try {
    const apiKey = req.query.key;
    if (apiKey !== process.env.REGISTRATION_FORM_KEY) {
      return res.status(403).send("Unauthorized: Invalid API Key");
    }
    const data = await Registration.find().lean();
    const parser = new Parser();
    const csv = parser.parse(data);
    res.header("Content-Type", "text/csv");
    res.attachment("registrations.csv");
    res.send(csv);
  } catch (err) {
    console.error("Error generating CSV:", err);
    res.status(500).send(err.message);
  }
});

module.exports = router;
