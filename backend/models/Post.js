import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  username: { type: String, required: true }, // Creator of the post
  content: { type: String, required: true }, // Content of the post
  timestamp: { type: Date, default: Date.now }, // Time the post was created
  likes: { type: [String], default: [] }, // List of users who liked the post
});

const Post = mongoose.model('Post', PostSchema);

export default Post;