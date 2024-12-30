import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); 
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-link">
        Home
      </Link>
      {user ? (
        <>
          <Link to={`/user/${user.username}`} className="navbar-link">
            My Profile
          </Link>
          <button onClick={handleLogout} className="navbar-button">
            Logout
          </button>
        </>
      ) : (
        <Link to="/login" className="navbar-link">
          Login
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
