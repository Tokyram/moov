import React, { useEffect, useState } from 'react';
import { PushNotificationSchema } from '@capacitor/push-notifications';
import { getDeliveredNotifications, requestPushNotificationsPermission, usePushNotificationListener } from '../../pushNotifications';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotificationComponent: React.FC = () => {
  const [notifications, setNotifications] = useState<PushNotificationSchema[]>([]);

  useEffect(() => {
    requestPushNotificationsPermission();
    getDeliveredNotifications();
  })
  
  usePushNotificationListener((notification) => {
    // Ajouter la notification reçue à la liste
    setNotifications(prevNotifications => [...prevNotifications, notification]);

    // Afficher la notification dans un toast
    toast.info(`📬 ${notification.title}: ${notification.body}`);
  });

  return (
    <div>
      <h1>Notifications reçues :</h1>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification.title} - {notification.body}</li>
        ))}
      </ul>

      {/* Conteneur pour afficher les toasts */}
      <ToastContainer
        position="top-right"
        autoClose={50000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

    </div>
  );
};

export default NotificationComponent;