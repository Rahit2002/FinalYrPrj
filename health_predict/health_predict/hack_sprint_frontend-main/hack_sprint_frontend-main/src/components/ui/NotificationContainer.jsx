import React from 'react';
import Notification from './Notification';

const NotificationContainer = ({ notifications, onRemove, position = 'top-right' }) => {
  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          isVisible={notification.isVisible}
          onClose={() => onRemove(notification.id)}
          duration={notification.duration}
          position={position}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;