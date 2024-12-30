import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Import Navbar component
import HomePage from './pages/HomePage'; // Import HomePage
import LoginPage from './pages/LoginPage'; // Import LoginPage
import UserPage from './pages/UserPage'; // Import UserPage
import ErrorBoundary from './components/ErrorBoundary'; // Import ErrorBoundary

function App() {
  return (
    <ErrorBoundary> {/* Wrap the entire app in ErrorBoundary */}
      <Navbar /> {/* Navbar is displayed on all pages */}
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* Route for HomePage */}
        <Route path="/login" element={<LoginPage />} /> {/* Route for LoginPage */}
        <Route path="/user/:username" element={<UserPage />} /> {/* Route for UserPage */}
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
