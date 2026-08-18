const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/biolens';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically (optional, for verification)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
const analysisRoutes = require('./routes/analysisRoutes');
app.use('/api/analysis', analysisRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: "BioLens DNA Analysis Backend API is active",
    endpoints: {
      upload: "POST /api/analysis/upload (form-data: fastaFile)",
      history: "GET /api/analysis/history",
      details: "GET /api/analysis/:id"
    },
    databaseStatus: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error]:', err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Database connection & Server initialization
console.log('Connecting to MongoDB...');
mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    app.listen(PORT, () => {
      console.log(`Express server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    console.warn('\n[Warning] Could not connect to local MongoDB database.');
    console.warn('Please ensure MongoDB is running: "brew services start mongodb-community" or modify MONGO_URI in .env');
    console.warn('Starting the server in DB-offline mode for endpoint testing...\n');
    
    app.listen(PORT, () => {
      console.log(`Express server is running on http://localhost:${PORT} (WARNING: Database Offline)`);
    });
  });
