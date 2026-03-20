const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

require('@dotenvx/dotenvx').config({ silent: true });

const app = express();

// ==========================
// ✅ CORS (from ENV)
// ==========================
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// ==========================
// ✅ Security
// ==========================
app.use(helmet({
  contentSecurityPolicy: false,
}));

// ==========================
// ✅ Rate Limiter
// ==========================
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));

// ==========================
// ✅ Middleware
// ==========================
app.use(express.json());

// ==========================
// ✅ MongoDB Connection
// ==========================
mongoose.connect(process.env.MongoDB_url)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// ==========================
// ✅ Routes
// ==========================
app.use('/api/leaders', require('./routes/Leaders'));
app.use('/api/gallery', require('./routes/GalleryServer'));
app.use('/api/contact', require('./routes/ContactServer'));
app.use('/api/aboutus', require('./routes/AboutServer'));
app.use('/api/enquiry', require('./routes/Enquiry'));
app.use('/api/mentors', require('./routes/Mentor'));
app.use('/api/register', require('./routes/RegistrationServer'));
app.use('/api/codecrafter-register', require('./routes/CodeCrafterRegistrationServer'));

// ==========================
// ✅ Health Check Route
// ==========================
app.get('/', (req, res) => {
  res.send('🚀 Backend API is running');
});

// ==========================
// ❌ 404 Handler
// ==========================
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ==========================
// ❌ Global Error Handler
// ==========================
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// ==========================
// ✅ Start Server
// ==========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});