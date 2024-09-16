import React, { useState } from 'react';
import { PushNotificationSchema } from '@capacitor/push-notifications';
import { usePushNotificationListener } from '../../pushNotifications';

const NotificationComponent: React.FC = () => {
  const [notifications, setNotifications] = useState<PushNotificationSchema[]>([]);

  usePushNotificationListener((notification) => {
    // Ajouter la notification reçue à la liste
    setNotifications(prevNotifications => [...prevNotifications, notification]);
  });

  return (
    <div>
      <h1>Notifications reçues :</h1>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification.title} - {notification.body}</li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationComponent;
