import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Use the new backend API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Handle response format from backend
      const userData = response.data.data || response.data.user || response.data;
      setUser(userData);
      setError(null);
    } catch (err) {
      console.error('Error fetching user:', err);
      // Don't clear token on network errors, only on auth errors
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
      }
      setError('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // First, check if the backend is running with a health check
      try {
        await axios.get(`${API_URL}/health`);
      } catch (healthErr) {
        console.error('Backend server health check failed:', healthErr);
        setError('Server unavailable. Please try again later.');
        setLoading(false);
        return false;
      }
      
      console.log('Attempting login with:', { username });
      
      const response = await axios.post(`${API_URL}/auth/login`, { 
        username, 
        password 
      });
      
      console.log('Login response:', response.data);
      
      // Handle new response format with nested data object
      const responseData = response.data.data || response.data;
      const { token, accessToken, user } = responseData;
      
      // Use accessToken if available, otherwise fall back to token
      const authToken = accessToken || token;
      
      // Store token in localStorage
      localStorage.setItem('token', authToken);
      
      // Set user data in state
      setUser(user);
      
      return true;
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.response) {
        console.log('Error response:', err.response.data);
        setError(err.response.data.message || 'Invalid credentials');
      } else if (err.request) {
        console.log('Error request:', err.request);
        setError('No response from server. Please check your connection.');
      } else {
        console.log('Error message:', err.message);
        setError('Login failed');
      }
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  // For development/debugging - direct login
  const directLogin = async () => {
    // This function is deprecated - use login() instead
    // Kept for backwards compatibility only
    console.warn('directLogin() is deprecated. Use login() instead.');
    return false;
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(`${API_URL}/auth/register`, {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        name: `${userData.firstName} ${userData.lastName}`,
        phone: userData.phone || undefined,
        // Note: Role is set to 'staff' by default in backend
      });

      console.log('Signup response:', response.data);

      // Handle response format
      const responseData = response.data.data || response.data;
      const { token, accessToken, user } = responseData;

      // Use accessToken if available, otherwise fall back to token
      const authToken = accessToken || token;

      // Store token in localStorage
      localStorage.setItem('token', authToken);

      // Set user data in state
      setUser(user);

      return true;
    } catch (err) {
      console.error('Signup error:', err);

      if (err.response) {
        console.log('Error response:', err.response.data);
        const errorMessage = err.response.data.message || 'Registration failed';
        setError(errorMessage);
        throw new Error(errorMessage);
      } else if (err.request) {
        console.log('Error request:', err.request);
        const errorMessage = 'No response from server. Please check your connection.';
        setError(errorMessage);
        throw new Error(errorMessage);
      } else {
        console.log('Error message:', err.message);
        const errorMessage = 'Registration failed';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    
    // Reset state
    setUser(null);
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    directLogin,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

export default AuthContext; 