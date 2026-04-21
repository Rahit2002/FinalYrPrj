import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaUserMd, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaHeart, FaPhone, FaIdCard, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SignupPage = () => {
  const [userType, setUserType] = useState('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    specialization: '', // For doctors
    licenseNumber: '', // For doctors
    gender: '' // For patients
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear messages when user types
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) return 'First name is required';
    if (!formData.lastName.trim()) return 'Last name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.phone.trim()) return 'Phone number is required';
    if (!formData.password) return 'Password is required';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    if (formData.password.length < 6) return 'Password must be at least 6 characters long';
    
    if (userType === 'doctor') {
      if (!formData.specialization) return 'Specialization is required for doctors';
      if (!formData.licenseNumber.trim()) return 'License number is required for doctors';
    }
    
    if (userType === 'patient') {
      if (!formData.gender) return 'Gender is required for patients';
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await register(formData, userType);
      
      if (response.success) {
        if (userType === 'doctor') {
          setSuccess('Registration successful! Your account is pending admin approval. You will be notified once approved.');
        } else {
          setSuccess('Registration successful! You can now log in with your credentials.');
        }
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          specialization: '',
          licenseNumber: '',
          gender: ''
        });
        
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const specializations = [
    'Cardiology', 'Neurology', 'Ophthalmology', 'General Medicine', 
    'Dermatology', 'Orthopedics', 'Pediatrics', 'Psychiatry'
  ];

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
        className="max-w-lg w-full space-y-8"
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
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Join HealthPredict</h2>
          <p className="text-gray-600">Create your account for better healthcare</p>
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

            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center"
              >
                <FaCheckCircle className="mr-2" />
                {success}
              </motion.div>
            )}

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                  placeholder="John"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                  placeholder="Doe"
                />
              </div>
            </div>

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
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaPhone className="text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            {/* Doctor-specific fields */}
            {userType === 'doctor' && (
              <>
                <div>
                  <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization
                  </label>
                  <select
                    id="specialization"
                    name="specialization"
                    required
                    value={formData.specialization}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Select Specialization</option>
                    {specializations.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Medical License Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaIdCard className="text-gray-400" />
                    </div>
                    <input
                      id="licenseNumber"
                      name="licenseNumber"
                      type="text"
                      required
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                      placeholder="MD123456789"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Patient-specific fields */}
            {userType === 'patient' && (
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            )}

            {/* Password Fields */}
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
                  placeholder="Create a strong password"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FaEye className="text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <Link to="/terms" className="text-pink-600 hover:text-pink-500">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-pink-600 hover:text-pink-500">
                  Privacy Policy
                </Link>
              </label>
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
                  Creating Account...
                </>
              ) : (
                `Create ${userType === 'patient' ? 'Patient' : 'Doctor'} Account`
              )}
            </motion.button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-pink-600 hover:text-pink-500 font-semibold transition-colors duration-300"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
