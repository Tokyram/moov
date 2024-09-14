// src/services/pushNotifications.ts
import { PushNotifications } from '@capacitor/push-notifications';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';

// Demander la permission pour les notifications push
export const requestPushNotificationsPermission = async () => {
  try {
    const permStatus = await PushNotifications.requestPermissions();

    if (permStatus.receive === 'granted') {
      console.log('Permission accordée pour les notifications.');

      // Inscription pour recevoir les notifications
      await PushNotifications.register();

      // Récupérer le token FCM (Firebase Cloud Messaging)
      const token = await FirebaseMessaging.getToken();
      console.log('Token FCM :', token.token);

      // Envoi du token au backend pour l'associer à l'utilisateur ou à l'appareil
      await fetch('https://4be8-41-74-208-240.ngrok-free.app/api/save-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token.token }),
      });
      

    } else {
      console.log('Permission refusée pour les notifications.');
    }
  } catch (err) {
    console.error('Erreur lors de la demande de permission pour les notifications :', err);
  }
};

// Écoute des notifications
export const setupNotificationListener = () => {
  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('Notification reçue :', notification);
    alert('Notification reçue : ' + JSON.stringify(notification));
  });

  PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
    console.log('Action sur la notification :', notification);
    alert('Action sur la notification : ' + JSON.stringify(notification));
  });
};
