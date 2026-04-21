import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaTimes } from 'react-icons/fa';
import Chatbot from './Chatbot';

const FloatingChatButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    console.log('Chat button clicked, current state:', isChatOpen);
    setIsChatOpen(!isChatOpen);
    console.log('Chat state after toggle:', !isChatOpen);
  };

  // Robotic hand wave animation
  const handWaveVariants = {
    wave: {
      rotate: [0, 14, -8, 14, -4, 10, 0],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        repeatDelay: 3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <>
      {/* Floating Chat Button with Robotic Hand */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
        onClick={() => setIsChatOpen((prev) => !prev)}
      >
        {/* Animated Robotic Hand */}
        <motion.div
          className="absolute -top-12 -right-8 text-4xl"
          animate="wave"
          variants={handWaveVariants}
          style={{ transformOrigin: "70% 70%" }}
        >
          👋
        </motion.div>
        <motion.button
          onClick={toggleChat}
          className={`w-20 h-20 rounded-full shadow-2xl flex items-center justify-center text-white transition-all duration-300 relative overflow-hidden ${
            isChatOpen 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-linear-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
          }`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          title={isChatOpen ? 'Close AI Assistant' : 'Open AI Healthcare Assistant'}
        >
          {/* Background glow effect */}
          <motion.div 
            className="absolute inset-0 bg-linear-to-br from-blue-400 to-purple-400 rounded-full opacity-50"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <AnimatePresence mode="wait">
            {isChatOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative z-10"
              >
                <FaTimes className="text-2xl" />
              </motion.div>
            ) : (
              <motion.div
                key="robot"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative z-10"
              >
                <motion.div
                  animate={{
                    y: [0, -2, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <FaRobot className="text-2xl" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* AI Status Indicator */}
        {!isChatOpen && (
          <motion.div
            className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ delay: 2, duration: 0.5 }}
          >
            <motion.div 
              className="w-2 h-2 bg-white rounded-full"
              animate={{
                scale: [1, 0.8, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        )}

        {/* Pulse animation ring */}
        {!isChatOpen && (
          <motion.div
            className="absolute inset-0 bg-blue-500 rounded-full opacity-30"
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.3, 0, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatDelay: 2
            }}
          />
        )}
        
        {/* Text label with enhanced styling */}
        {!isChatOpen && (
          <motion.div
            className="absolute -left-3 top-1/2 transform -translate-y-1/2 -translate-x-full"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 3, duration: 0.5 }}
          >
            <motion.div 
              className="bg-linear-to-r from-blue-800 to-purple-800 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap shadow-xl border border-blue-600"
              animate={{
                y: [0, -1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="flex items-center space-x-2">
                <motion.span
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🤖
                </motion.span>
                <span className="font-medium">AI Health Assistant</span>
              </div>
              <div className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2">
                <div className="w-0 h-0 border-l-4 border-l-purple-800 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {/* Chatbot Component */}
      <AnimatePresence>
        {isChatOpen && (
          <Chatbot 
            isOpen={isChatOpen} 
            onClose={() => setIsChatOpen(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChatButton;