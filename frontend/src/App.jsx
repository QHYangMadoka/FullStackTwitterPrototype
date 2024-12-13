import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Import Navbar component
import HomePage from './pages/HomePage'; // Import HomePage
import LoginPage from './pages/LoginPage'; // Import LoginPage
import UserPage from './pages/UserPage'; // Import UserPage

function App() {
  return (
    <div>
      <Navbar /> {/* Navbar is displayed on all pages */}
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* Route for HomePage */}
        <Route path="/login" element={<LoginPage />} /> {/* Route for LoginPage */}
        <Route path="/user/:username" element={<UserPage />} /> {/* Route for UserPage */}
      </Routes>
    </div>
  );
}

export default App;
