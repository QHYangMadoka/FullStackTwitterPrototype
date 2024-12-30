import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a context for authentication
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Retrieve user from localStorage on initialization
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Login function
  const login = (username) => {
    const newUser = { username };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser)); // Save to localStorage
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Clear from localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
