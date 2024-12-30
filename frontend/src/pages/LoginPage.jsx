import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import AuthContext for user state management
import { API_BASE_URL } from '../config/api'; // Import API_BASE_URL
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Add confirm password field
  const [loading, setLoading] = useState(false); // Add loading state
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between login and register modes
  const { login } = useAuth(); // Access login function from context
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verify if the two passwords match (for registration)
    if (isRegistering && password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);

      // Determine endpoint based on login or registration
      const endpoint = isRegistering
        ? `${API_BASE_URL}/api/users/register`
        : `${API_BASE_URL}/api/auth/login`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (isRegistering) {
          alert('Registration successful! You can now log in.');
          setIsRegistering(false); // Switch to login mode
          setUsername('');
          setPassword('');
          setConfirmPassword('');
        } else {
          // Ensure `username` exists in the response
          if (!data.username) {
            throw new Error('Username not returned from the server.');
          }

          login(data.username); // Update user state in context
          navigate(`/user/${data.username}`); // Navigate to user's profile
        }
      } else {
        // Display server error message
        alert(data.error || (isRegistering ? 'Registration failed.' : 'Login failed.'));
      }
    } catch (error) {
      console.error(`${isRegistering ? 'Registration' : 'Login'} error:`, error);
      alert('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <h1>{isRegistering ? 'Register' : 'Login'}</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {isRegistering && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        )}
        <button type="submit" disabled={loading}>
          {loading
            ? isRegistering
              ? 'Registering...'
              : 'Logging in...'
            : isRegistering
            ? 'Register'
            : 'Login'}
        </button>
      </form>
      <button
        onClick={() => {
          setIsRegistering(!isRegistering);
          setUsername('');
          setPassword('');
          setConfirmPassword('');
        }}
        className="toggle-button"
      >
        {isRegistering ? 'Back to Login' : 'Create an Account'}
      </button>
    </div>
  );
};

export default LoginPage;
