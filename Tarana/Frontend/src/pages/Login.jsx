import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { login, register, clearError } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    company: ''
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  // Clear error when switching tabs
  useEffect(() => {
    dispatch(clearError());
  }, [activeTab, dispatch]);

  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) dispatch(clearError());
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) dispatch(clearError());
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(login({
      email: loginData.email,
      password: loginData.password
    }));
    if (login.fulfilled.match(result)) {
      toast.success('Login successful!');
      navigate('/profile');
    } else {
      toast.error(result.payload || 'Login failed');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (registerData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    const result = await dispatch(register({
      name: registerData.name,
      email: registerData.email,
      phone: registerData.phone,
      company: registerData.company,
      address: '',
      password: registerData.password
    }));

    if (register.fulfilled.match(result)) {
      toast.success('Account created successfully!');
      navigate('/profile');
    } else {
      toast.error(result.payload || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-[#f54a00] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Login / Sign Up</h1>
          <p className="text-lg md:text-xl">
            Access your account to manage orders, wishlist, and personalized settings.
          </p>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <svg className="w-12 h-12 mx-auto mb-4 text-trana-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="text-xl font-bold mb-2">Track Orders</h3>
              <p className="text-gray-600">Manage and track all your orders</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <svg className="w-12 h-12 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h3 className="text-xl font-bold mb-2">Save Wishlist</h3>
              <p className="text-gray-600">Save your favorite products</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <svg className="w-12 h-12 mx-auto mb-4 text-trana-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <h3 className="text-xl font-bold mb-2">Get Notifications</h3>
              <p className="text-gray-600">Stay updated with latest offers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Login/Registration Form */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 md:px-8">
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-lg">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-8">
              <button
                onClick={() => {
                  setActiveTab('login');
                  dispatch(clearError());
                }}
                className={`flex-1 py-3 text-center font-semibold transition ${
                  activeTab === 'login'
                    ? 'text-trana-orange border-b-2 border-trana-orange'
                    : 'text-gray-600 hover:text-trana-orange'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setActiveTab('register');
                  dispatch(clearError());
                }}
                className={`flex-1 py-3 text-center font-semibold transition ${
                  activeTab === 'register'
                    ? 'text-trana-orange border-b-2 border-trana-orange'
                    : 'text-gray-600 hover:text-trana-orange'
                }`}
              >
                Register
              </button>
            </div>

            {/* Lock Icon */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto bg-trana-orange rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}
            {registerData.password && registerData.confirmPassword && 
             registerData.password !== registerData.confirmPassword && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                Passwords do not match
              </div>
            )}
            {registerData.password && registerData.password.length < 6 && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                Password must be at least 6 characters
              </div>
            )}

            {activeTab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <h2 className="text-2xl font-bold text-center mb-6">Account Login</h2>
                <div>
                  <label className="block text-sm font-semibold mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    placeholder="your.email@example.com"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-orange"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    placeholder="Enter your password"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-orange"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={loginData.rememberMe}
                      onChange={handleLoginChange}
                      className="w-4 h-4 text-trana-orange border-gray-300 rounded focus:ring-trana-orange"
                    />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-trana-orange hover:underline">
                    Forgot password?
                  </a>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-trana-orange text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-6">
                <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
                <div>
                  <label className="block text-sm font-semibold mb-2">Full Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={registerData.name}
                    onChange={handleRegisterChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-orange"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Email Address <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    placeholder="your.email@example.com"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-orange"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={registerData.phone}
                    onChange={handleRegisterChange}
                    placeholder="+91 XXXXXX XXXXX"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-orange"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Company Name</label>
                  <input
                    type="text"
                    name="company"
                    value={registerData.company}
                    onChange={handleRegisterChange}
                    placeholder="Enter company name (optional)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-orange"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Password <span className="text-red-500">*</span></label>
                  <input
                    type="password"
                    name="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    placeholder="Create a password"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-orange"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Confirm Password <span className="text-red-500">*</span></label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    placeholder="Confirm your password"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-orange"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-trana-orange text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
