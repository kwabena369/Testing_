const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const organizationRoutes = require('./routes/organizationRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
require('dotenv').config();

const app = express();

// Use CORS middleware
app.use(cors({
  origin: ['http://localhost:5173'], // Restrict to your frontend's origin in production
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
}));

app.use(express.json());

// Sync database and start server
sequelize.sync().then(() => {
  console.log('Database synced and connected successfully');
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
}).catch((error) => {
  console.error('Error connecting to the database:', error);
});

app.use('/api/organizations', organizationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/auth', authRoutes);
