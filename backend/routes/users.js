import express from 'express';
import User from '../models/User.js'; // Import user model
import Post from '../models/Post.js'; // Assuming you have a Post model

const router = express.Router();

// Get user details
router.get('/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch user's posts (if you have a Post model and user-post relationship)
    const posts = await Post.find({ username }).sort({ timestamp: -1 });

    res.json({
      username: user.username,
      description: user.description || '',
      joinedDate: user.createdAt,
      posts,
    });
  } catch (err) {
    console.error('Error fetching user details:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user description
router.put('/:username/description', async (req, res) => {
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
});

export default router;
