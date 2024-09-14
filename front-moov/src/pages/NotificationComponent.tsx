import React, { useEffect } from 'react';
import { requestPushNotificationsPermission, setupNotificationListener } from '../../pushNotifications';
import { ToastContainer } from 'react-toastify';
import './NotificationComponent.css';

const NotificationComponent: React.FC = () => {
  useEffect(() => {
    const setupNotifications = async () => {
      try {
        await requestPushNotificationsPermission();
        setupNotificationListener();
      } catch (error) {
        console.error('Erreur lors de la configuration des notifications :', error);
      }
    };

    setupNotifications();
  }, []);

  return (
    <div>
      <ToastContainer 
        position="top-center"
        autoClose={5000}
        hideProgressBar={true}
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
