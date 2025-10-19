const express = require('express');
const mongoose = require('mongoose');
const { Parser } = require('json2csv');
const router = express.Router();
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  subject: String,
  message: String
});
const Contact = mongoose.model('Contact', contactSchema);

router.post('/', async (req, res) => {
  const contact = new Contact(req.body);
  await contact.save();
  res.status(201).json({ message: 'Form submitted' });
});

router.get('/csv', async (req, res) => {
    try {
      const apiKey = req.query.key;
      if (apiKey !== process.env.Contact_form_key) {
        return res.status(403).send('Unauthorized: Invalid API Key');
      }
      const data = await Contact.find().lean();
      const parser = new Parser();
      const csv = parser.parse(data);
      res.header('Content-Type', 'text/csv');
      res.attachment('contact.csv');
      res.send(csv);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  

module.exports = router;

