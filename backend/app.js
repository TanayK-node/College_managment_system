const express = require('express');
const cors = require('cors'); // Import cors
const authRoutes = require('./src/routes/authRoutes');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Use auth routes
app.use('/api/auth', authRoutes);

module.exports = app;