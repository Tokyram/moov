<<<<<<< Updated upstream
import React, { useState } from 'react';
import { PushNotificationSchema } from '@capacitor/push-notifications';
import { usePushNotificationListener } from '../../pushNotifications';

const NotificationComponent: React.FC = () => {
  const [notifications, setNotifications] = useState<PushNotificationSchema[]>([]);
=======
import React, { useEffect, useState } from 'react';
import { requestPushNotificationsPermission, setupNotificationListener } from '../../pushNotifications';
import './NotificationComponent.css';
import { PushNotificationSchema } from '@capacitor/push-notifications';

const NotificationComponent: React.FC = () => {
  const [notificationData, setNotificationData] = useState<PushNotificationSchema | null>(null);

  useEffect(() => {
    const setupNotifications = async () => {
      try {
        // Demander la permission pour les notifications
        await requestPushNotificationsPermission();

        // Configuration du listener pour les notifications
        setupNotificationListener((notification) => {
          console.log('Notification reçue dans le composant :', notification);
          setNotificationData(notification); // Mise à jour de l'état avec la notification reçue
        });

      } catch (error) {
        console.error('Erreur lors de la configuration des notifications :', error);
      }
    };
>>>>>>> Stashed changes

  usePushNotificationListener((notification) => {
    // Ajouter la notification reçue à la liste
    setNotifications(prevNotifications => [...prevNotifications, notification]);
  });

  return (
    <div>
<<<<<<< Updated upstream
      <h1>Notifications reçues :</h1>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification.title} - {notification.body}</li>
        ))}
      </ul>
=======
      <h2>Notifications</h2>
      {notificationData ? (
        <div className="notification-display">
          <h3>{notificationData.title || 'Nouvelle notification'}</h3>
          <p>{notificationData.body || 'Vous avez reçu une nouvelle notification.'}</p>
        </div>
      ) : (
        <p>Aucune notification reçue pour le moment.</p>
      )}
>>>>>>> Stashed changes
    </div>
  );
};

export default NotificationComponent;
