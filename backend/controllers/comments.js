import Comment from '../models/Comment.js';
import User from '../models/User.js';

// Fetch all comments for a post
export const getComments = async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await Comment.find({ postId }).sort({ timestamp: -1 });

    // Fetch avatars for all comments
    const enrichedComments = await Promise.all(
      comments.map(async (comment) => {
        const user = await User.findOne({ username: comment.username }).select('avatar');
        return {
          ...comment.toObject(),
          userAvatar: user?.avatar || '', // Add user avatar to comment
        };
      })
    );

    res.status(200).json(enrichedComments);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create a new comment
export const createComment = async (req, res) => {
  const { postId } = req.params;
  const { username, content } = req.body;
  try {
    const newComment = new Comment({ postId, username, content });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    console.error('Error creating comment:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
    const { commentId } = req.params; // Extract comment ID from URL parameters
    try {
      const deletedComment = await Comment.findByIdAndDelete(commentId);
      if (!deletedComment) {
        return res.status(404).json({ error: 'Comment not found' });
      }
      res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (err) {
      console.error('Error deleting comment:', err);
      res.status(500).json({ error: 'Server error' });
    }
};




