import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../utils/authService.js';

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
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    // Check if user is logged in on app initialization
    const initializeAuth = () => {
      try {
        const currentUser = authService.getCurrentUser();
        const currentUserType = authService.getUserType();
        
        if (currentUser && currentUserType) {
          setUser(currentUser);
          setUserType(currentUserType);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password, type) => {
    try {
      setLoading(true);
      let response;
      
      if (type === 'patient') {
        response = await authService.loginPatient(email, password);
      } else if (type === 'doctor') {
        response = await authService.loginDoctor(email, password);
      } else {
        throw new Error('Invalid user type');
      }

      if (response.success) {
        setUser(response.data);
        setUserType(type);
        return response;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData, type) => {
    try {
      setLoading(true);
      let response;
      
      if (type === 'patient') {
        response = await authService.registerPatient(userData);
      } else if (type === 'doctor') {
        response = await authService.registerDoctor(userData);
      } else {
        throw new Error('Invalid user type');
      }

      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      setUserType(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await authService.updateUserProfile(profileData);
      
      if (response.success) {
        // Update local user state
        setUser(prev => ({ ...prev, ...response.data }));
      }
      
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      const response = await authService.getUserProfile();
      if (response.success) {
        setUser(response.data);
      }
      return response;
    } catch (error) {
      console.error('Error refreshing profile:', error);
      throw error;
    }
  };

  const value = {
    user,
    userType,
    loading,
    login,
    register,
    logout,
    updateProfile,
    refreshProfile,
    isAuthenticated: !!user,
    isPatient: userType === 'patient',
    isDoctor: userType === 'doctor'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;