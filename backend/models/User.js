import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Store hashed password
  description: { type: String, default: '' }, // Optional user description
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

export default mongoose.model('User', UserSchema);
