import { useState, useCallback } from 'react';

export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((message, type = 'success', duration = 5000) => {
    const id = Date.now() + Math.random();
    const notification = {
      id,
      message,
      type,
      duration,
      isVisible: true
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration + 300); // Add 300ms for animation
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods
  const showSuccess = useCallback((message, duration = 5000) => {
    return showNotification(message, 'success', duration);
  }, [showNotification]);

  const showError = useCallback((message, duration = 7000) => {
    return showNotification(message, 'error', duration);
  }, [showNotification]);

  const showWarning = useCallback((message, duration = 6000) => {
    return showNotification(message, 'warning', duration);
  }, [showNotification]);

  const showInfo = useCallback((message, duration = 5000) => {
    return showNotification(message, 'info', duration);
  }, [showNotification]);

  return {
    notifications,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
    clearAllNotifications
  };
};

export default useNotification;