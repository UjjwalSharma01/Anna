const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const forumRoutes = require('./routes/forumRoutes');
const schemeRoutes = require('./routes/schemeRoutes');
const homeRoutes = require('./routes/homeRoutes');
const cropRoutes = require('./routes/cropRoutes');
const weatherRoutes = require('./routes/weatherRoutes');

// Import middleware
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS setup - expanded to allow more origins
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://annadata-production-frontend.com' 
    : ['http://localhost:3000', 'http://localhost:5000', 'https://fuzzy-space-fiesta-gjv5vpwq4w7f6vg-3000.app.github.dev'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Static file serving
app.use('/static', express.static(path.join(__dirname, '../public')));
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// MongoDB connection - using direct connection string for immediate testing
const MONGODB_URI = 'mongodb+srv://ujjwalsharma:qo7CD6Dvm71yZLJ7@cluster0.vamyzgu.mongodb.net/annadata?retryWrites=true&w=majority';
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error('❌ Error connecting to MongoDB:', err);
    console.error('Connection string being used:', MONGODB_URI);
    process.exit(1); // Exit if can't connect to database
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/weather', weatherRoutes);

// API health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development',
    database: 'MongoDB Atlas connected'
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
});

module.exports = app;
