import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Simulate API call - in real app, this would be an actual API request
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock user data
        const mockUser = {
          id: '1',
          name: 'John Doe',
          email: email,
          phone: '+91 98765 43210',
          address: '123 Main Street, Raipur, Chhattisgarh, India',
          company: 'ABC Industries',
          avatar: null
        };
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        resolve(mockUser);
      }, 500);
    });
  };

  const signup = (userData) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const newUser = {
          id: Date.now().toString(),
          ...userData,
          avatar: null
        };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        resolve(newUser);
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    signup,
    logout,
    updateUser,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

