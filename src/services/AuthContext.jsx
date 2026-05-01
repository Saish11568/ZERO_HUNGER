import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 1. Run auth check ONLY ONCE when the provider mounts
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('zerohunger_auth');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to parse auth data:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = (userData) => {
    localStorage.setItem('zerohunger_auth', JSON.stringify(userData));
    setUser(userData);
    
    // Redirect based on role after login
    if (userData.role === 'NGO') {
      navigate('/ngo-dashboard');
    } else if (userData.role === 'Volunteer') {
      navigate('/dispatch');
    } else {
      navigate('/dashboard'); // Default for Donor/Supermarket
    }
  };

  const logout = () => {
    localStorage.removeItem('zerohunger_auth');
    setUser(null);
    navigate('/login', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
