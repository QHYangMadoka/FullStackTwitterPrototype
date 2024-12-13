import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth(); // Access user state
  const [posts, setPosts] = useState([]); // All posts
  const [filteredPosts, setFilteredPosts] = useState([]); // Posts matching search criteria
  const [newPost, setNewPost] = useState({ username: user?.username || '', content: '' });
  const [searchQuery, setSearchQuery] = useState(''); // User input for search

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/posts');
        const data = await response.json();
        setPosts(data);
        setFilteredPosts(data); // Initialize filtered posts
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
    setFilteredPosts(results); // Update filtered posts
  }, [searchQuery, posts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return; // Ensure user is logged in
    if (!newPost.content.trim()) {
      alert('Post content cannot be empty.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username, content: newPost.content }),
      });
      if (response.ok) {
        setNewPost({ username: user.username, content: '' });
        const updatedPosts = await (await fetch('http://localhost:5000/api/posts')).json();
        setPosts(updatedPosts);
        setFilteredPosts(updatedPosts);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="homepage">
      <h1>Latest Posts</h1>

      {/* Search Bar */}
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
            <h2>{post.username}</h2>
            <p>{post.content}</p>
            <small>{new Date(post.timestamp).toLocaleString()}</small>
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
