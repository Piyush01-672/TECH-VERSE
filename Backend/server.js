const express = require('express');
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
app.use(helmet());

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
const CodeCrafterRegistration = require('./routes/CodeCrafterRegistrationServer');

app.use('/leaders', Leader);
app.use('/gallery', Gallery);
app.use('/contact', Contact);
app.use('/aboutus', AboutUs);
app.use('/enquiry', Enquiry);
app.use('/mentors', Mentor);
app.use('/register', Register);
app.use('/codecrafter-register', CodeCrafterRegistration);
 
 app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
 })
