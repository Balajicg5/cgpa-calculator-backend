const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const errorMiddleware = require('./middleware/error.middleware');

// Routes
const authRoutes = require('./routes/auth.routes');
const semesterRoutes = require('./routes/semester.routes');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
require('./config/db.config');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/semesters', semesterRoutes);
app.get('/api/test', (req, res) => {
  res.send('✅ Backend is working');
});


app.use(errorMiddleware)
// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})