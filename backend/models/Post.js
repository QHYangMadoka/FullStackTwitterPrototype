import mongoose from 'mongoose'; 

const PostSchema = new mongoose.Schema({
  username: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', PostSchema);

export default Post; 
