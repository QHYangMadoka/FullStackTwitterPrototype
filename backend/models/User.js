import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Store hashed password
  description: { type: String, default: '' }, // Optional user description
  avatar: { type: String, default: '' }, // Store Base64 encoded avatar
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
