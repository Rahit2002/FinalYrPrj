import { useState, useEffect } from 'react';

// Custom hook to handle responsive design
export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setWindowSize({ width, height });
      
      // Define breakpoints (matching Tailwind CSS)
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsDesktop(width >= 1024);
    };

    // Set initial values
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    windowSize,
    isMobile,
    isTablet,
    isDesktop,
    breakpoint: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
  };
};

// Custom hook for managing chat state globally
export const useChat = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [messageCount, setMessageCount] = useState(0);

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => {
    setIsChatOpen(false);
    setHasUnreadMessages(false);
  };
  
  const toggleChat = () => setIsChatOpen(!isChatOpen);
  
  const markAsRead = () => setHasUnreadMessages(false);
  
  const addMessage = () => {
    setMessageCount(prev => prev + 1);
    if (!isChatOpen) {
      setHasUnreadMessages(true);
    }
  };

  return {
    isChatOpen,
    hasUnreadMessages,
    messageCount,
    openChat,
    closeChat,
    toggleChat,
    markAsRead,
    addMessage
  };
};

export default useResponsive;