const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const app = express();
require('@dotenvx/dotenvx').config({ silent: true });
app.use(cors({
  // origin: process.env.FRONTEND_URL,
  // credentials: true
}));
app.use(helmet({
  contentSecurityPolicy: false,
}));

// Global Rate Limiter: max 100 requests per 15 minutes
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, 
  legacyHeaders: false,
});
app.use(globalLimiter);

app.use(express.json());

mongoose.connect(process.env.MongoDB_url, {
}).then(() => {
  console.log('Connected to MongoDB Database!');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});



 const Gallery = require('./routes/GalleryServer');
 const Contact = require('./routes/ContactServer');
 const AboutUs = require('./routes/AboutServer');
 const Enquiry = require('./routes/Enquiry');
 const Mentor = require('./routes/Mentor');
 const Leader = require('./routes/Leaders');
const Register = require('./routes/RegistrationServer');
const CodeCrafterRegistration = require('./routes/CodeCrafterRegistrationServer');

app.use('/api/leaders', Leader);
app.use('/api/gallery', Gallery);
app.use('/api/contact', Contact);
app.use('/api/aboutus', AboutUs);
app.use('/api/enquiry', Enquiry);
app.use('/api/mentors', Mentor);
app.use('/api/register', Register);
app.use('/api/codecrafter-register', CodeCrafterRegistration);

const frontendDistPath = path.join(__dirname, '..', 'Frontend', 'dist');
console.log(frontendDistPath);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(frontendDistPath));
app.get(/^(.*)$/, (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});
 
 app.listen(process.env.PORT || 5000, '0.0.0.0', () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
 })
