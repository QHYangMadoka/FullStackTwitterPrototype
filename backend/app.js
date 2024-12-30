import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import postRoutes from './routes/posts.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import commentRoutes from './routes/comments.js';
import User from './models/User.js';

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();

// Serve backend directory as static
app.use('/static', express.static(path.join(__dirname)));

// Allowed origins for CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [
      'https://qhmadoka-twitterapp.onrender.com',
      'http://localhost:5173', // For local development
    ];

// Configure CORS middleware
app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Allow cookies or authentication headers
  })
);

// Middleware for parsing JSON requests with larger payloads
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully!');
    if (process.env.CREATE_DEFAULT_USER === 'true') {
      createDefaultUser(); // Ensure default user exists
    }
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Function to create a default user if it doesn't exist
const createDefaultUser = async () => {
  try {
    const existingUser = await User.findOne({ username: 'Alice' });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('Password123', 10);
      const defaultUser = new User({
        username: 'Alice',
        password: hashedPassword,
        description: "This is Alice's profile!",
        avatar: '/static/default.png', // Default avatar path
      });
      await defaultUser.save();
      console.log('Default user created: Alice');
    } else {
      console.log('Default user already exists');
    }
  } catch (error) {
    console.error('Error creating default user:', error);
  }
};

// Define routes
app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
