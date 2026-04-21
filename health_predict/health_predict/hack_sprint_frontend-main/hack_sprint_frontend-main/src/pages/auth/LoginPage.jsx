import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaUserMd, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaHeart, FaSpinner } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [userType, setUserType] = useState('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user types
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await login(formData.email, formData.password, userType);
      
      if (response.success) {
        // Redirect based on user type
        if (userType === 'patient') {
          navigate('/patient-dashboard');
        } else {
          navigate('/doctor-dashboard');
        }
      }
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
      if(localStorage.getItem('user')) {
        navigate('/patient-dashboard');
      }
    }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full space-y-8"
      >
        {/* Logo and Title */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex items-center justify-center w-20 h-20 bg-pink-500 rounded-full mx-auto mb-4"
          >
            <FaHeart className="text-3xl text-white" />
          </motion.div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your HealthPredict account</p>
        </div>

        {/* User Type Selection */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setUserType('patient')}
              className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg transition-all duration-300 ${
                userType === 'patient'
                  ? 'bg-white shadow-md text-pink-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaUser className="mr-2" />
              Patient
            </button>
            <button
              type="button"
              onClick={() => setUserType('doctor')}
              className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg transition-all duration-300 ${
                userType === 'doctor'
                  ? 'bg-white shadow-md text-green-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaUserMd className="mr-2" />
              Doctor
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
              >
                {error}
              </motion.div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FaEye className="text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-green-600 hover:text-green-500 transition-colors duration-300"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-pink-500 hover:bg-pink-600 hover:shadow-lg'
              } text-white`}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Signing In...
                </>
              ) : (
                `Sign In as ${userType === 'patient' ? 'Patient' : 'Doctor'}`
              )}
            </motion.button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-green-600 hover:text-green-500 font-semibold transition-colors duration-300"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-center text-sm text-gray-500"
        >
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;