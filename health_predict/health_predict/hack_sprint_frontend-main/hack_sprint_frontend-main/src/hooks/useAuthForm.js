import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export const useAuthForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login, register } = useAuth();

  const clearMessages = useCallback(() => {
    setError('');
    setSuccess('');
  }, []);

  const handleLogin = useCallback(async (email, password, userType) => {
    setLoading(true);
    clearMessages();
    
    try {
      const response = await login(email, password, userType);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [login, clearMessages]);

  const handleRegister = useCallback(async (userData, userType) => {
    setLoading(true);
    clearMessages();
    
    try {
      const response = await register(userData, userType);
      setSuccess(
        userType === 'doctor' 
          ? 'Registration successful! Your account is pending admin approval.'
          : 'Registration successful! You can now log in.'
      );
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [register, clearMessages]);

  return {
    loading,
    error,
    success,
    handleLogin,
    handleRegister,
    clearMessages,
    setError,
    setSuccess
  };
};

export default useAuthForm;