import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';
import '../styles/UserPage.css';

const UserPage = () => {
  const { username: paramUsername } = useParams(); // Get username from route params
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Get authenticated user and logout function

  // State variables
  const [userAvatar, setUserAvatar] = useState(''); // User avatar (Base64 or empty)
  const [description, setDescription] = useState(''); // User description
  const [editing, setEditing] = useState(false); // Editing state
  const [newDescription, setNewDescription] = useState(''); // Temp description
  const [userPosts, setUserPosts] = useState([]); // User posts
  const [loadingError, setLoadingError] = useState(''); // Error message for data loading
  const [deletingAccount, setDeletingAccount] = useState(false); // Deleting account state

  const username = paramUsername || user?.username; // Determine username

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (username) {
      fetchUserProfile(); // Load user profile data
      fetchUserPosts(); // Load user posts
    }
  }, [username, user, navigate]);

  // Fetch user profile from backend
  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${username}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();
      setUserAvatar(data.avatar ? `data:image/png;base64,${data.avatar}` : ''); // Convert avatar to Base64
      setDescription(data.description || 'No description provided.');
      setNewDescription(data.description || '');
      setLoadingError('');
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setLoadingError('Failed to load user data. Please try again later.');
    }
  };

  // Fetch user posts from backend
  const fetchUserPosts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts?username=${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user posts');
      }

      const data = await response.json();
      setUserPosts(
        data.filter((post) => post.username === username).map((post) => ({
          ...post,
          userAvatar: post.userAvatar ? `data:image/png;base64,${post.userAvatar}` : '', // Convert avatar to Base64
        })) || []
      ); // Update posts
    } catch (error) {
      console.error('Error fetching user posts:', error);
      setLoadingError('Failed to load posts. Please try again later.');
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${username}/avatar`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUserAvatar(`data:image/png;base64,${data.avatar}`); // Update avatar with Base64 data
        alert('Avatar updated successfully!');
      } else {
        alert('Failed to upload avatar. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Error uploading avatar.');
    }
  };

  // Save updated description
  const handleDescriptionSave = async () => {
    if (!newDescription.trim()) {
      alert('Description cannot be empty.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${username}/description`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: newDescription }),
      });

      if (response.ok) {
        setDescription(newDescription); // Update description
        setEditing(false); // Exit editing mode
        alert('Description updated successfully!');
      } else {
        alert('Failed to update description.');
      }
    } catch (error) {
      console.error('Error updating description:', error);
      alert('Error updating description.');
    }
  };

  // Delete account function
  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingAccount(true);
      const response = await fetch(`${API_BASE_URL}/api/users/${username}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        alert('Your account has been deleted successfully.');
        logout(); // Clear auth context
        navigate('/login', { replace: true }); // Redirect to login page
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to delete account.');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setDeletingAccount(false);
    }
  };

  if (!user) {
    return null; // Do not render if user is not authenticated
  }

  return (
    <div className="user-page">
      <h1>{username}'s Profile</h1>

      <div className="profile-info">
        <div className="avatar-section">
          {userAvatar ? (
            <img src={userAvatar} alt={`${username}'s avatar`} className="avatar-circle" />
          ) : (
            <p>No avatar available</p>
          )}
          {user.username === username && (
            <div>
              <input type="file" accept="image/*" onChange={handleAvatarUpload} />
              <small>Click to upload a new avatar</small>
            </div>
          )}
        </div>

        <div className="edit-description">
          {editing ? (
            <>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
              <button onClick={handleDescriptionSave}>Save</button>
              <button className="cancel-button" onClick={() => setEditing(false)}>Cancel</button>
            </>
          ) : (
            <>
              <div className="description-text">{description}</div>
              {user.username === username && (
                <button onClick={() => setEditing(true)}>Edit Description</button>
              )}
            </>
          )}
        </div>

        {user.username === username && (
          <div className="delete-account-wrapper">
            <button
              className="delete-account-button"
              onClick={handleDeleteAccount}
              disabled={deletingAccount}
            >
              {deletingAccount ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        )}
      </div>

      <div className="user-posts">
        <h2>User Posts</h2>
        {loadingError ? (
          <p className="error-message">{loadingError}</p>
        ) : userPosts.length > 0 ? (
          userPosts.map((post) => (
            <div key={post._id} className="post">
              <div className="post-header">
                {post.userAvatar ? (
                  <img
                    src={post.userAvatar}
                    alt={`${post.username}'s avatar`}
                    className="avatar-circle"
                  />
                ) : null}
                <h2>{post.username}</h2>
              </div>
              <p>{post.content}</p>
              <small>{new Date(post.timestamp).toLocaleString()}</small>
            </div>
          ))
        ) : (
          <p>No posts to display.</p>
        )}
      </div>
    </div>
  );
};

export default UserPage;
