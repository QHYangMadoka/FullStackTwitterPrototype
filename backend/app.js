import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import postRoutes from './routes/posts.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import User from './models/User.js';

dotenv.config();

const app = express();

// Allowed origins for CORS
const allowedOrigins = [
  'https://qhmadoka-twitterApp.onrender.com', // Replace with your actual frontend URL
  'http://localhost:5173' // For local development
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // If you need to allow cookies or authentication headers
}));

// Middleware
app.use(bodyParser.json());
app.use('/api/users', userRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected successfully!');
    createDefaultUser();
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Default user creation
const createDefaultUser = async () => {
  const existingUser = await User.findOne({ username: 'Alice' });
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('Password123', 10);
    const defaultUser = new User({
      username: 'Alice',
      password: hashedPassword,
      description: 'This is Alice\'s profile!',
    });
    await defaultUser.save();
    console.log('Default user created: Alice');
  } else {
    console.log('Default user already exists');
  }
};

// Routes
app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
