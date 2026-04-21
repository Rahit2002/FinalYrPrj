import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const Notification = ({ 
  message, 
  type = 'success', 
  isVisible = false, 
  onClose, 
  duration = 5000,
  position = 'top-right' 
}) => {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);
  }, [isVisible]);

  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300); // Wait for animation to complete
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      case 'error':
        return <FaExclamationTriangle className="text-red-500" />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-500" />;
      case 'info':
      default:
        return <FaInfoCircle className="text-blue-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`fixed ${getPositionClasses()} z-50 max-w-sm w-full mx-auto`}
        >
          <div className={`${getBackgroundColor()} border rounded-lg shadow-lg p-4`}>
            <div className="flex items-start">
              <div className="shrink-0 mr-3 mt-0.5">
                {getIcon()}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800 font-medium">
                  {message}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="shrink-0 ml-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;