import express from 'express';
import { getPosts, createPost, deletePost, likePost } from '../controllers/posts.js';

const router = express.Router();

router.get('/', getPosts); // Fetch all posts
router.post('/', createPost); // Create a new post
router.delete('/:id', deletePost); // Delete a specific post
router.post('/:id/like', likePost);

export default router;
