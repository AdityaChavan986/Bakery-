import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { Eye, EyeOff, Coffee } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Get the backend URL from environment variables
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const Login: React.FC = () => {
  // Active tab state
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'admin'>('login');
  
  // Login form state
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Admin login form state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [isAdminSubmitting, setIsAdminSubmitting] = useState(false);
  
  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSignupSubmitting, setIsSignupSubmitting] = useState(false);
  const [signupError, setSignupError] = useState('');
  
  const { login, adminLogin, error } = useAuth();
  const navigate = useNavigate();
  
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdminSubmitting(true);
    console.log('Attempting admin login with:', { email: adminEmail, password: adminPassword });
    
    try {
      await adminLogin(adminEmail, adminPassword);
      console.log('Admin login successful, navigating to /admin');
      navigate('/admin');
    } catch (err) {
      console.error('Admin login failed:', err);
    } finally {
      setIsAdminSubmitting(false);
    }
  };
  
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSignupSubmitting(true);
    setSignupError('');
    
    // Validate passwords match
    if (signupPassword !== signupConfirmPassword) {
      setSignupError('Passwords do not match');
      setIsSignupSubmitting(false);
      return;
    }
    
    // Validate password strength
    if (signupPassword.length < 8) {
      setSignupError('Password must be at least 8 characters long');
      setIsSignupSubmitting(false);
      return;
    }
    
    try {
      // Call signup API using axios with the backend URL
      const response = await axios.post(`${BACKEND_URL}/api/users/register`, {
        name: signupName,
        email: signupEmail,
        password: signupPassword,
      });
      
      const data = response.data;
      
      if (!data.success) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // Show success message
      toast.success('Registration successful! Please sign in.');
      
      // On successful signup, switch to login tab
      setActiveTab('login');
      // Pre-fill login form with signup credentials
      setEmail(signupEmail);
      setPassword('');
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      setSignupError(errorMessage);
      toast.error(errorMessage);
      console.error('Signup failed:', err);
    } finally {
      setIsSignupSubmitting(false);
    }
  };
  
  // Clear any errors when switching tabs
  useEffect(() => {
    setSignupError('');
  }, [activeTab]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-card">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Coffee size={32} className="text-primary-600" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-gray-800">
            {activeTab === 'login' ? 'Welcome Back' : activeTab === 'signup' ? 'Create Account' : 'Admin Login'}
          </h2>
          <p className="mt-2 text-gray-600">
            {activeTab === 'login' ? 'Sign in to your account' : 
             activeTab === 'signup' ? 'Fill in your details to get started' : 
             'Sign in to admin dashboard'}
          </p>
        </div>
        
        {activeTab === 'login' && (
            <div className="mt-2 text-sm text-gray-500">
              <p>Use the following credentials for demo:</p>
              <p>Email: user@example.com</p>
              <p>Password: password</p>
            </div>
          )}
        
        {/* Tab navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`flex-1 py-2 px-4 text-center ${activeTab === 'login' ? 'border-b-2 border-primary-500 text-primary-600 font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('login')}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-2 px-4 text-center ${activeTab === 'signup' ? 'border-b-2 border-primary-500 text-primary-600 font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
          <button
            className={`flex-1 py-2 px-4 text-center ${activeTab === 'admin' ? 'border-b-2 border-primary-500 text-primary-600 font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('admin')}
          >
            Admin
          </button>
        </div>
        
        {/* Login Form */}
        {activeTab === 'login' ? (
          <>
            <form className="space-y-6" onSubmit={handleLoginSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative mt-1">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={16} className="text-gray-400" />
                    ) : (
                      <Eye size={16} className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={isSubmitting}
                >
                  Sign In
                </Button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button 
                  onClick={() => setActiveTab('signup')} 
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Sign up
                </button>
              </p>
            </div>
          </>
        ) : activeTab === 'admin' ? (
          <>
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleAdminLoginSubmit}>
              <div>
                <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="adminEmail"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative mt-1">
                  <input
                    id="adminPassword"
                    name="password"
                    type={showAdminPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                  >
                    {showAdminPassword ? (
                      <EyeOff size={16} className="text-gray-400" />
                    ) : (
                      <Eye size={16} className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={isAdminSubmitting}
                >
                  Sign In
                </Button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button 
                  onClick={() => setActiveTab('signup')} 
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Sign up
                </button>
              </p>
            </div>
          </>
        ) : (
          /* Sign Up Form */
          <>
            {signupError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                {signupError}
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSignupSubmit}>
              <div>
                <label htmlFor="signupName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="signupName"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label htmlFor="signupEmail" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="signupEmail"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label htmlFor="signupPassword" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative mt-1">
                  <input
                    id="signupPassword"
                    name="password"
                    type={showSignupPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                  >
                    {showSignupPassword ? (
                      <EyeOff size={16} className="text-gray-400" />
                    ) : (
                      <Eye size={16} className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} className="text-gray-400" />
                    ) : (
                      <Eye size={16} className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={isSignupSubmitting}
                >
                  Create Account
                </Button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button 
                  onClick={() => setActiveTab('login')} 
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Sign in
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;