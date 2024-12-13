import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';

const UserPage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [description, setDescription] = useState('');
  const [joinedDate, setJoinedDate] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (username) {
      fetch(`${API_BASE_URL}/users/${username}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch user data');
          }
          return res.json();
        })
        .then((data) => {
          setPosts(data.posts || []);
          setDescription(data.description || '');
          setJoinedDate(data.joinedDate || '');
        })
        .catch((error) => console.error('Error fetching user data:', error));
    }
  }, [username]);

  const handleDescriptionSave = () => {
    fetch(`${API_BASE_URL}/users/${username}/description`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to update description');
        }
        return res.json();
      })
      .then((data) => {
        setDescription(data.description);
        setEditing(false);
      })
      .catch((err) => {
        console.error('Error updating description:', err);
        alert('Failed to save description. Please try again.');
      });
  };

  if (!username) {
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h1>Please provide a username</h1>
        <button onClick={() => navigate('/')}>Go to Home</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{username}'s Profile</h1>
      <p>Joined: {joinedDate ? new Date(joinedDate).toLocaleDateString() : 'Loading...'}</p>

      <div style={{ marginBottom: '1.5rem' }}>
        {editing ? (
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', padding: '0.5rem' }}
            />
            <button onClick={handleDescriptionSave} style={{ marginRight: '1rem' }}>
              Save
            </button>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </div>
        ) : (
          <div>
            <p>Description: {description || 'No description provided.'}</p>
            {user?.username === username && <button onClick={() => setEditing(true)}>Edit</button>}
          </div>
        )}
      </div>

      <h2>User Posts</h2>
      <div>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="post">
              <p>{post.content}</p>
              <small>{new Date(post.timestamp).toLocaleDateString()}</small>
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
