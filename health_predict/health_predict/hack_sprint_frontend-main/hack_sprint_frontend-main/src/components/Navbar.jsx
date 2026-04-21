import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaBars, FaTimes, FaUserMd, FaUser, FaHome, FaInfoCircle, FaPlusCircle, FaUserAlt, FaEnvelope, FaSignOutAlt, FaAmbulance, FaComments } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, userType, logout } = useAuth();

  // Base navigation items (always visible)
  const publicNavItems = [
    { name: 'Home', path: '/', icon: FaHome },
    { name: 'About', path: '/about', icon: FaInfoCircle },
    { name: 'Emergency', path: '/emergency', icon: FaAmbulance },
    { name: 'Contact', path: '/contact', icon: FaEnvelope },
  ];

  // Profile item (only visible when authenticated)
  const profileNavItem = { name: 'Profile', path: '/profile', icon: FaUserAlt };

  // Combine nav items based on authentication status
  const navItems = isAuthenticated 
    ? [...publicNavItems, profileNavItem] 
    : publicNavItems;

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="font-lato bg-white shadow-lg border-b border-gray-100 sticky top-0 z-40"
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 md:py-1">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center"
            >
              <div className="flex items-center justify-center w-10 h-10  rounded-full mr-1">
                <FaPlusCircle className="text-pink-800 text-lg" size={28} />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
                Health<span className="text-pink-800">Predict</span>
              </h1>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-2">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isActive(item.path)
                        ? 'text-pink-500'
                        : 'text-gray-600 hover:text-pink-400'
                    }`}
                  >
                    <IconComponent className="mr-2" size={18} />
                    <p className='text-md'>{item.name}</p>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">
                      {user?.fullName || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {userType}
                    </p>
                  </div>
                </div>

                {/* Dashboard Link */}
                <Link to={userType === 'patient' ? '/patient-dashboard' : '/doctor-dashboard'}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="border-2 border-green-500 hover:border-green-600 text-green-500 hover:text-green-600 px-4 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-300 flex items-center"
                  >
                    <FaUserMd className="mr-2 text-sm" />
                    Dashboard
                  </motion.button>
                </Link>

                {/* Logout Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-300 flex items-center"
                >
                  <FaSignOutAlt className="mr-2 text-sm" />
                  Logout
                </motion.button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-300 flex items-center cursor-pointer"
                  >
                    <FaUser className="mr-2 text-sm" />
                    Login
                  </motion.button>
                </Link>
                
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="border-2 border-green-500 hover:border-green-600 text-green-500 hover:text-green-600 px-4 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-300 flex items-center cursor-pointer"
                  >
                    <FaUserMd className="mr-2 text-sm" />
                    Sign Up
                  </motion.button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-blue-600 p-2 transition-colors duration-300"
            >
              {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isMenuOpen ? 'auto' : 0, 
          opacity: isMenuOpen ? 1 : 0 
        }}
        transition={{ duration: 0.3 }}
        className="md:hidden overflow-hidden bg-white border-t border-gray-100"
      >
        <div className="px-4 py-4 space-y-3">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive(item.path)
                    ? 'text-pink-500'
                    : 'text-gray-600 hover:text-pink-400'
                }`}
              >
                <IconComponent className="mr-3" />
                {item.name}
              </Link>
            );
          })}
          
          <div className="border-t border-gray-100 pt-4 space-y-3">
            {isAuthenticated ? (
              <>
                {/* User Info Mobile */}
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-gray-700">
                    {user?.fullName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {userType}
                  </p>
                </div>

                <Link
                  to={userType === 'patient' ? '/patient-dashboard' : '/doctor-dashboard'}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-300"
                >
                  <FaUserMd className="mr-3" />
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-300"
                >
                  <FaSignOutAlt className="mr-3" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center px-3 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors duration-300"
                >
                  <FaUser className="mr-3" />
                  Login
                </Link>
                
                <Link
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-300"
                >
                  <FaUserMd className="mr-3" />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
}

export default Navbar;