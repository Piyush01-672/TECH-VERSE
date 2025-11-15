const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
require('@dotenvx/dotenvx').config({ silent: true });
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MongoDB_url, {
}).then(() => {
  console.log('Connected to MongoDB Database!');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

app.get('/', (req, res) => {
    return res.json('Hello World!');
 })

 const Gallery = require('./routes/GalleryServer');
 const Contact = require('./routes/ContactServer');
 const AboutUs = require('./routes/AboutServer');
 const Enquiry = require('./routes/Enquiry');
 const Mentor = require('./routes/Mentor');
 const Leader = require('./routes/Leaders');
const Register = require('./routes/RegistrationServer');

app.use('/leaders', Leader);
app.use('/gallery', Gallery);
app.use('/contact', Contact);
app.use('/aboutus', AboutUs);
app.use('/enquiry', Enquiry);
app.use('/mentors', Mentor);
app.use('/register', Register);
 
 app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
 })
