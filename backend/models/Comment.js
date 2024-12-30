import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }, // Reference to the Post
  username: { type: String, required: true }, // Username of the commenter
  content: { type: String, required: true },  // Content of the comment
  timestamp: { type: Date, default: Date.now }, // Time the comment was created
});

const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;
