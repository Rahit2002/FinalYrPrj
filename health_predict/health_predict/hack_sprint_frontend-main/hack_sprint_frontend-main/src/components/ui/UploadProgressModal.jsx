import React from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaBrain, FaLightbulb, FaCheckCircle, FaSpinner } from 'react-icons/fa';

const UploadProgressModal = ({ isVisible, currentStep, message }) => {
  const steps = [
    { key: 'uploading', icon: FaUpload, label: 'Uploading Report', color: 'blue' },
    { key: 'analyzing', icon: FaBrain, label: 'Analyzing Report', color: 'purple' },
    { key: 'generating', icon: FaLightbulb, label: 'Generating Recommendations', color: 'orange' },
    { key: 'completed', icon: FaCheckCircle, label: 'Process Complete', color: 'green' }
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.key === currentStep);
  };

  const getStepStatus = (stepIndex) => {
    const currentIndex = getCurrentStepIndex();
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  const getColorClasses = (color, status) => {
    const colors = {
      blue: {
        active: 'bg-blue-600 text-white',
        completed: 'bg-blue-600 text-white',
        pending: 'bg-gray-200 text-gray-400'
      },
      purple: {
        active: 'bg-purple-600 text-white',
        completed: 'bg-purple-600 text-white',
        pending: 'bg-gray-200 text-gray-400'
      },
      orange: {
        active: 'bg-orange-600 text-white',
        completed: 'bg-orange-600 text-white',
        pending: 'bg-gray-200 text-gray-400'
      },
      green: {
        active: 'bg-green-600 text-white',
        completed: 'bg-green-600 text-white',
        pending: 'bg-gray-200 text-gray-400'
      }
    };
    return colors[color][status] || colors.blue[status];
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl p-8 max-w-4xl w-full shadow-2xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing Your Report</h2>
          <p className="text-gray-600">Please wait while we process your medical report</p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const status = getStepStatus(index);
            
            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex items-center space-x-4"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  getColorClasses(step.color, status)
                }`}>
                  {status === 'active' && currentStep !== 'completed' ? (
                    <FaSpinner className="animate-spin text-xl" />
                  ) : (
                    <Icon className="text-xl" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className={`font-semibold transition-colors duration-300 ${
                    status === 'active' ? 'text-gray-800' :
                    status === 'completed' ? 'text-gray-800' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </h3>
                  
                  {status === 'active' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    </motion.div>
                  )}
                  
                  {status === 'completed' && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-green-600 mt-1"
                    >
                      ✓ Completed
                    </motion.p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Current Status Message */}
        <motion.div
          key={message}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-700 font-medium">{message}</p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: '0%' }}
              animate={{ 
                width: currentStep === 'completed' ? '100%' : 
                       `${((getCurrentStepIndex() + 1) / steps.length) * 100}%` 
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0%</span>
            <span>
              {currentStep === 'completed' ? '100%' : 
               `${Math.round(((getCurrentStepIndex() + 1) / steps.length) * 100)}%`}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UploadProgressModal;