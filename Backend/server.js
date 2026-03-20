const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

require('@dotenvx/dotenvx').config({ silent: true });

const app = express();

// ✅ CORS (adjust if frontend separate)
app.use(cors());

// ✅ Security
app.use(helmet({
  contentSecurityPolicy: false,
}));

// ✅ Rate limiter
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));

// ✅ Body parser
app.use(express.json());

// ✅ MongoDB
mongoose.connect(process.env.MongoDB_url)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));


// ✅ Routes
app.use('/api/leaders', require('./routes/Leaders'));
app.use('/api/gallery', require('./routes/GalleryServer'));
app.use('/api/contact', require('./routes/ContactServer'));
app.use('/api/aboutus', require('./routes/AboutServer'));
app.use('/api/enquiry', require('./routes/Enquiry'));
app.use('/api/mentors', require('./routes/Mentor'));
app.use('/api/register', require('./routes/RegistrationServer'));
app.use('/api/codecrafter-register', require('./routes/CodeCrafterRegistrationServer'));


// ==========================
// ✅ FIX STARTS HERE
// ==========================

// 👉 Correct frontend build path
const frontendPath = path.join(__dirname, '../Frontend/dist');

// 👉 Debug log (VERY IMPORTANT)
console.log("Frontend build path:", frontendPath);

// 👉 Serve static frontend
app.use(express.static(frontendPath));

// 👉 Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 👉 Root check (prevents "Not Found")
app.get('/', (req, res) => {
  res.send('🚀 API is running');
});

// 👉 SPA fallback (ONLY if frontend exists)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});


// ==========================
// ✅ START SERVER
// ==========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});