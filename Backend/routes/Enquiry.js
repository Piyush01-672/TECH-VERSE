const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const EnquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  regNumber: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  department: { type: String, required: true },
  batch: { type: String, required: true },
  interests: { type: [String], required: true },
  otherInterest: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Enquiry = mongoose.model('Enquiry', EnquirySchema);

router.get('/', async (req, res) => {
  try {
    const enquiries = await Enquiry.find();
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post('/', async (req, res) => {
  try {
    const data = req.body;

    
    if (!data.name || !data.regNumber || !data.contact || !data.email || !data.department || !data.batch || !data.interests) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }

    const newEnquiry = new Enquiry(data);
    await newEnquiry.save();

    res.status(201).json({ message: 'Enquiry submitted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
