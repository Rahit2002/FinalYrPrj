import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPaperPlane, 
  FaRobot, 
  FaUser, 
  FaTimes, 
  FaComments,
  FaTrash,
  FaDownload,
  FaSpinner,
  FaExclamationTriangle,
  FaLightbulb,
  FaMicrophone,
  FaStop
} from 'react-icons/fa';
import chatService from '../utils/chatService';
import { useResponsive } from '../hooks/useResponsive';

const Chatbot = ({ isOpen, onClose, className = '' }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionInfo, setSessionInfo] = useState({ isActive: false });
  const [showSuggestions, setShowSuggestions] = useState(true);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  
  // Responsive hook
  const { isMobile, isTablet, isDesktop } = useResponsive();

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  // Initialize chat session when component mounts or opens
  useEffect(() => {
    if (isOpen && !sessionInfo.isActive) {
      initializeChat();
    }
  }, [isOpen]);

  const initializeChat = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await chatService.startChatSession();
      
      if (response.success) {
        setSessionInfo(chatService.getSessionInfo());
        
        // Add welcome message
        const welcomeMessage = {
          id: Date.now(),
          type: 'bot',
          message: response.data.welcomeMessage,
          timestamp: new Date().toISOString()
        };
        
        setMessages([welcomeMessage]);
        setShowSuggestions(true);
        console.log('Chat initialized successfully');
      }
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      setError('Failed to start chat session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: inputMessage.trim(),
      timestamp: new Date().toISOString()
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);
    setShowSuggestions(false);

    try {
      const response = await chatService.sendMessage(userMessage.message);
      
      if (response.success) {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          message: response.data.botResponse,
          timestamp: response.data.timestamp
        };
        
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setError(error.message);
      
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        message: `Sorry, I encountered an error: ${error.message}`,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    setShowSuggestions(false);
    // Auto-send suggestion or let user review it
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const clearChat = () => {
    setMessages([]);
    chatService.clearHistory();
    setShowSuggestions(true);
    setError(null);
  };

  const exportChat = () => {
    const conversation = chatService.exportConversation();
    const dataStr = JSON.stringify(conversation, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const retryLastMessage = () => {
    const lastUserMessage = [...messages].reverse().find(msg => msg.type === 'user');
    if (lastUserMessage) {
      setInputMessage(lastUserMessage.message);
      setError(null);
    }
  };

  if (!isOpen) return null;

  const suggestions = chatService.getSuggestedPrompts();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`fixed ${isMobile ? 'inset-0' : 'bottom-4 right-4 w-96 h-128'} bg-white ${isMobile ? 'rounded-t-3xl' : 'rounded-3xl'} shadow-2xl z-50 flex flex-col border border-gray-200 ${className}`}
    >
      {/* Header */}
      <div className="bg-linear-to-r from-pink-600 to-pink-700 text-white p-4 rounded-t-3xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white text-gray-600 bg-opacity-20 rounded-full flex items-center justify-center">
            <FaRobot className="text-xl" />
          </div>
          <div>
            <h3 className="font-semibold"><p className='text-white'>Healthcare Assistant</p></h3>
            <p className="text-xs opacity-80">
              {sessionInfo.isActive ? 'Online' : 'Connecting...'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Action buttons */}
          <button
            onClick={onClose}
            className="p-2 hover:scale-110 hover:bg-opacity-20 rounded-full transition-colors cursor-pointer"
            title="Close chat"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
      >
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.type === 'user'
                    ? 'bg-pink-600 text-white ml-4'
                    : message.type === 'error'
                    ? 'bg-red-100 text-red-800 border border-red-200 mr-4'
                    : 'bg-white text-gray-800 border border-gray-200 mr-4'
                }`}
              >
                {/* Message Header */}
                <div className="flex items-center space-x-2 mb-1">
                  {message.type === 'user' ? (
                    <FaUser className="text-xs opacity-70" />
                  ) : message.type === 'error' ? (
                    <FaExclamationTriangle className="text-xs" />
                  ) : (
                    <FaRobot className="text-xs opacity-70" />
                  )}
                  <span className="text-xs opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                
                {/* Message Content */}
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.message}
                </div>
                
                {/* Retry button for error messages */}
                {message.type === 'error' && (
                  <button
                    onClick={retryLastMessage}
                    className="mt-2 text-xs bg-red-200 hover:bg-red-300 text-red-800 px-2 py-1 rounded transition-colors"
                  >
                    Retry
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2 mr-4">
              <div className="flex items-center space-x-2">
                <FaSpinner className="animate-spin text-blue-600" />
                <span className="text-sm text-gray-600">Typing...</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Suggestions */}
        {showSuggestions && messages.length <= 1 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <FaLightbulb className="mr-2" />
              Try asking about:
            </div>
            <div className="grid grid-cols-1 gap-2">
              {suggestions.slice(0, 4).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-pink-50 transition-all duration-200 text-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Error display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-3"
          >
            <div className="flex items-center text-red-800">
              <FaExclamationTriangle className="mr-2" />
              <span className="text-sm">{error}</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white rounded-b-3xl">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your health question here..."
              disabled={isLoading || !sessionInfo.isActive}
              rows={1}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl resize-none focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
              style={{
                minHeight: '48px',
                maxHeight: '120px'
              }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
            />
          </div>
          
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading || !sessionInfo.isActive}
            className="bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 text-white p-3 rounded-2xl transition-colors disabled:cursor-not-allowed shrink-0"
            title="Send message"
          >
            {isLoading ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaPaperPlane />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Chatbot;