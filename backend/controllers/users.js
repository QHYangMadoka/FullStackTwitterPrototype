import fs from 'fs/promises';
import multer from 'multer';
import path from 'path';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import bcrypt from 'bcrypt';

// Configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const uploadMiddleware = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);
    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG, or PNG files are allowed'));
    }
  },
  limits: { fileSize: 500 * 1024 }, // Limit file size to 500KB
}).single('avatar');

// User registration
export const registerUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      password: hashedPassword,
      avatar: '', // Avatar is initially empty
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error('Error during user registration:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select('username description avatar');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      username: user.username,
      description: user.description || 'No description provided.',
      avatar: user.avatar || '', // Return empty string if no avatar
    });
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Upload or update user avatar
export const uploadAvatar = async (req, res) => {
  const { username } = req.params;

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Read file data
    const fileData = await fs.readFile(req.file.path);

    // Convert file to Base64
    const base64Avatar = fileData.toString('base64');

    const updatedUser = await User.findOneAndUpdate(
      { username },
      { avatar: base64Avatar }, // Store Base64 encoded data
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove temporary file
    await fs.unlink(req.file.path);

    res.status(200).json({
      avatar: base64Avatar, // Return Base64 data
      message: 'Avatar uploaded successfully!',
    });
  } catch (err) {
    console.error('Error uploading avatar:', err);
    res.status(500).json({ error: 'Server error' });
  }
};



// Update user description
export const updateUserDescription = async (req, res) => {
  const { username } = req.params;
  const { description } = req.body;

  if (!description || description.trim() === '') {
    return res.status(400).json({ error: 'Description cannot be empty' });
  }

  try {
    const user = await User.findOneAndUpdate(
      { username },
      { description },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ description: user.description });
  } catch (err) {
    console.error('Error updating user description:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user profile with their posts
export const getUserWithPosts = async (req, res) => {
  const { username } = req.params;

  try {
    // Fetch user details
    const user = await User.findOne({ username }).select('username description avatar');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch posts created by the user
    const posts = await Post.find({ username }).sort({ timestamp: -1 });

    res.status(200).json({
      username: user.username,
      description: user.description || 'No description provided.',
      avatar: user.avatar || '', // Return empty string if no avatar
      posts, // Return posts in response
    });
  } catch (err) {
    console.error('Error fetching user profile with posts:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


// Delete user account and all related data
export const deleteUserAccount = async (req, res) => {
  const { username } = req.params;

  try {
    // Find and delete the user
    const user = await User.findOneAndDelete({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete all posts created by the user
    await Post.deleteMany({ username });

    // Delete all comments created by the user
    await Comment.deleteMany({ username });

    res.status(200).json({ message: 'User account and all related data deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user account:', error);
    res.status(500).json({ error: 'Failed to delete user account.' });
  }
};


