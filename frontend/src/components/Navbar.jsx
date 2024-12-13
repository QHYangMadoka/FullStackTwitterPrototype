import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

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
          <button onClick={logout} className="navbar-button">
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
