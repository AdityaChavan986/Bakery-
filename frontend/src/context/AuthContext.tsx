import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { User } from '../types';
import { toast } from 'react-hot-toast';

// Get the backend URL from environment variables
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

// Configure axios defaults
axios.defaults.baseURL = BACKEND_URL;

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean; // Add loading state
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

    

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Add loading state

  // Check for stored token and user data on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        const adminStatus = localStorage.getItem('isAdmin');
        
        if (storedUser && token) {
          try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setIsAdmin(adminStatus === 'true');
            // Set axios default header for all requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Optional: Verify token with backend
            // This would be a good place to validate the token with the server
            // const response = await axios.get('/api/users/verify-token');
            // if (!response.data.success) throw new Error('Invalid token');
          } catch (err) {
            console.error('Failed to parse stored user data or invalid token', err);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('isAdmin');
            setUser(null);
            setIsAdmin(false);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      
      const response = await axios.post(`${BACKEND_URL}/api/users/login`, { email, password });
      const data = response.data;
      
      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Store token
      const token = data.token;
      localStorage.setItem('token', token);
      
      // Set axios default header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Create user object
      const userData: User = {
        id: Date.now(), // Temporary ID
        name: email.split('@')[0], // Using email as temporary name
        email: email,
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=800'
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      toast.success('Login successful!');
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Login error:', err);
    }
  };

  const adminLogin = async (email: string, password: string) => {
    try {
      setError(null);
      console.log('AdminLogin - Attempting admin login with:', { email });
      
      const response = await axios.post(`${BACKEND_URL}/api/users/admin`, { email, password });
      const data = response.data;
      console.log('AdminLogin - Server response:', data);
      
      if (!data.success) {
        throw new Error(data.message || 'Admin login failed');
      }
      
      // Store token
      const token = data.token;
      localStorage.setItem('token', token);
      localStorage.setItem('isAdmin', 'true');
      console.log('AdminLogin - Token and isAdmin stored in localStorage');
      
      // Set axios default header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Create admin user object
      const userData: User = {
        id: 0, // Admin ID is 0
        name: 'Admin',
        email: email,
        avatar: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=800'
      };
      
      // Explicitly set admin status first
      setIsAdmin(true);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('AdminLogin - Admin status set:', { isAdmin: true, user: userData });
      toast.success('Admin login successful!');
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Admin login failed';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Admin login error:', err);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    // Remove authorization header
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isAdmin, 
      isLoading,
      login, 
      adminLogin,
      logout, 
      error 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};