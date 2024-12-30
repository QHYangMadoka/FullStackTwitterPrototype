import Post from '../models/Post.js';
import User from '../models/User.js';

// Get all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ timestamp: -1 });

    // Extract all usernames from posts
    const usernames = [...new Set(posts.map((post) => post.username))];

    // Batch query users to fetch avatars
    const users = await User.find({ username: { $in: usernames } }).select('username avatar');
    const userMap = users.reduce((map, user) => {
      map[user.username] = user.avatar;
      return map;
    }, {});

    // Add avatars to posts
    const postsWithAvatars = posts.map((post) => ({
      ...post.toObject(),
      userAvatar: userMap[post.username] || '', // Add user avatar to post
    }));

    res.json(postsWithAvatars);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { username, content } = req.body;

    // Validate request data
    if (!username || !content) {
      return res.status(400).json({ error: 'Username and content are required' });
    }

    const newPost = new Post({ username, content, likes: [] });
    await newPost.save();

    res.status(201).json(newPost);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(400).json({ error: 'Invalid data' });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body; // Get username from the request body

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if the logged-in user is the post's owner
    if (post.username !== username) {
      return res.status(403).json({ error: 'You are not authorized to delete this post' });
    }

    await post.remove();
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Error deleting post' });
  }
};


// Like or unlike a post
export const likePost = async (req, res) => {
  try {
    const { id } = req.params; // Post ID
    const { username } = req.body; // Username of the user liking/unliking the post

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const hasLiked = post.likes.includes(username); // Check if the user has already liked the post

    if (hasLiked) {
      // Unlike the post
      post.likes = post.likes.filter((user) => user !== username);
    } else {
      // Like the post
      post.likes.push(username);
    }

    await post.save(); // Save the changes

    res.status(200).json(post); // Return the updated post
  } catch (err) {
    console.error('Error toggling like:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


