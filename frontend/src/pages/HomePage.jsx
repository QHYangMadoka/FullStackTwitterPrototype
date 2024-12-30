import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';
import '../styles/HomePage.css';
import commentIcon from '../assets/comment.jpg';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [newPost, setNewPost] = useState({ username: user?.username || '', content: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [commentsVisible, setCommentsVisible] = useState({});
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLike = async (postId) => {
    if (!user) {
      alert('Please log in to like posts.');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: user.username }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post._id === updatedPost._id ? updatedPost : post))
        );
        setFilteredPosts((prevPosts) =>
          prevPosts.map((post) => (post._id === updatedPost._id ? updatedPost : post))
        );
      } else {
        const errorData = await response.json();
        console.error('Error liking post:', errorData.error);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Do you really want to delete this post?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
        setFilteredPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to delete the post.');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post. Please try again.');
    }
  };

  const toggleComments = async (postId) => {
    if (commentsVisible[postId]) {
      setCommentsVisible((prev) => ({
        ...prev,
        [postId]: false,
      }));
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/comments/${postId}/comments`);
      if (response.ok) {
        const comments = await response.json();
        const enrichedComments = comments.map((comment) => ({
          ...comment,
          userAvatar: comment.userAvatar
            ? `data:image/png;base64,${comment.userAvatar}`
            : '/default-avatar.png',
        }));

        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId ? { ...post, comments: enrichedComments } : post
          )
        );
        setCommentsVisible((prev) => ({
          ...prev,
          [postId]: true,
        }));
      } else {
        console.error('Failed to fetch comments');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCreateComment = async (postId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/comments/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username, content: newComment }),
      });

      if (!response.ok) {
        const errorData = await response.text(); // Fetch raw response
        console.error('Error creating comment:', errorData);
        return;
      }

      const newCommentData = await response.json();
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, comments: [newCommentData, ...(post.comments || [])] }
            : post
        )
      );
      setNewComment('');
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handleDeleteComment = async (commentId, postId) => {
    if (!window.confirm('Do you really want to delete this comment?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? { ...post, comments: post.comments.filter((comment) => comment._id !== commentId) }
              : post
          )
        );
      } else {
        console.error('Error deleting comment:', await response.json());
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/posts`);
        const data = await response.json();
        setPosts(
          data.map((post) => ({
            ...post,
            userAvatar: post.userAvatar
              ? `data:image/png;base64,${post.userAvatar}`
              : '/default-avatar.png',
            comments: post.comments?.map((comment) => ({
              ...comment,
              userAvatar: comment.userAvatar
                ? `data:image/png;base64,${comment.userAvatar}`
                : '/default-avatar.png',
            })) || [],
          }))
        );
        setFilteredPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    setNewPost({ username: user?.username || '', content: '' });
  }, [user]);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const results = posts.filter(
      (post) =>
        post.username.toLowerCase().includes(lowercasedQuery) ||
        post.content.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredPosts(results);
  }, [searchQuery, posts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.content.trim()) {
      alert('Post content cannot be empty.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username, content: newPost.content }),
      });
      if (response.ok) {
        window.location.reload(); // Force page reload
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="homepage">
      <h1>Latest Posts</h1>
      <input
        type="text"
        placeholder="Search posts by username or content..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />
      <div className="post-list">
        {filteredPosts.map((post) => (
          <div key={post._id} className="post">
            <button className="delete-button" onClick={() => handleDelete(post._id)}>
              &times;
            </button>
            <div className="post-header">
              <img
                src={post.userAvatar}
                alt={`${post.username}'s avatar`}
                className="avatar-circle"
              />
              <h2>{post.username}</h2>
            </div>
            <p>{post.content}</p>
            <div className="post-footer">
              <div className="like-section">
                <button className="like-button" onClick={() => handleLike(post._id)}>
                  {Array.isArray(post.likes) && post.likes.includes(user?.username) ? '👎 Unlike' : '👍 Like'}
                </button>
                <span>{Array.isArray(post.likes) ? post.likes.length : 0} likes</span>
              </div>
              <button className="comment-button" onClick={() => toggleComments(post._id)}>
                <img src={commentIcon} alt="Comment" className="comment-icon" />
                <span className="comment-text">Comment</span>
              </button>
              <small className="post-date">{new Date(post.timestamp).toLocaleString()}</small>
            </div>
            {commentsVisible[post._id] && (
              <div className="comments-section">
                <h3>Comments</h3>
                {post.comments?.map((comment) => (
                  <div key={comment._id} className="comment-item">
                    <img
                      src={comment.userAvatar}
                      alt={`${comment.username}'s avatar`}
                      className="avatar-circle-small"
                    />
                    <div className="comment-content-wrapper">
                      <div>
                        <strong className="comment-username">{comment.username}</strong>
                        <div className="comment-content">{comment.content}</div>
                      </div>
                      <div className="comment-timestamp">
                        {new Date(comment.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <button
                      className="delete-comment-button"
                      onClick={() => handleDeleteComment(comment._id, post._id)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
                <textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="new-comment-input"
                />
                <button className="create-comment-button" onClick={() => handleCreateComment(post._id)}>
                  Post
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {user ? (
        <form onSubmit={handleSubmit} className="create-post-form">
          <h2>Create a New Post</h2>
          <input type="text" placeholder="Your name" value={user.username} disabled />
          <textarea
            placeholder="Your post content"
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            required
          ></textarea>
          <button type="submit">Post</button>
        </form>
      ) : (
        <p>Please log in to create a post.</p>
      )}
    </div>
  );
};

export default HomePage;
