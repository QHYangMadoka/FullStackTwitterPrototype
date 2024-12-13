import Post from '../models/Post.js'; 


export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ timestamp: -1 }); 
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};


export const createPost = async (req, res) => {
  try {
    const { username, content } = req.body;
    const newPost = new Post({ username, content });
    await newPost.save();
    res.status(201).json({ message: 'Post created successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
};

// Delete a specific post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    await Post.findByIdAndDelete(id); // Find and delete post by ID
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting post' });
  }
};
