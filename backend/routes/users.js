import express from 'express';
import {
  registerUser,
  getUserProfile,
  uploadAvatar,
  updateUserDescription,
  uploadMiddleware,
  getUserWithPosts,
  deleteUserAccount,
} from '../controllers/users.js';

const router = express.Router();

// User registration route
router.post('/register', registerUser);

// Get user profile
router.get('/:username', getUserProfile);

// Upload user avatar
router.put('/:username/avatar', uploadMiddleware, uploadAvatar);

// Update user description
router.put('/:username/description', updateUserDescription);

// Get user profile with posts
router.get('/:username/posts', getUserWithPosts);

// Delete user account
router.delete('/:username', deleteUserAccount);


export default router;
