import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Added isLoading state
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true); // Start loading
      try {
        const token = localStorage.getItem('access_token');
        const storedUserId = localStorage.getItem('user_id');
        const storedRole = localStorage.getItem('role');
        if (token && storedUserId) {
          setIsAuthenticated(true);
          setUserId(storedUserId);
          setRole(storedRole);
        } else {
          setIsAuthenticated(false);
          setUserId(null);
          setRole(null);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUserId(null);
        setRole(null);
      } finally {
        setIsLoading(false); // Done loading
      }
    };

    checkAuth();
  }, []);

  const login = (token, userId, userRole) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user_id', userId);
    localStorage.setItem('role', userRole);
    setIsAuthenticated(true);
    setUserId(userId);
    setRole(userRole);
    setIsLoading(false);
  };

  const logout = () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('role');
      setIsAuthenticated(false);
      setUserId(null);
      setRole(null);
      setIsLoading(false);
      navigate('/login');
  };

  return { isAuthenticated, userId, role, isLoading, login, logout }; // Added isLoading to return value
};

export default useAuth;