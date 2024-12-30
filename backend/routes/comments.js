import express from 'express';
import { getComments, createComment, deleteComment } from '../controllers/comments.js';

const router = express.Router();

// Route to get all comments for a specific post
router.get('/:postId/comments', getComments); // Change `:id` to `:postId`

// Route to create a new comment
router.post('/:postId/comments', createComment); // Change `:id` to `:postId`

// Route to delete a comment
router.delete('/:commentId', deleteComment);

export default router;
