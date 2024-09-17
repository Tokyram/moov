import { PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { useEffect } from 'react';

// Demander la permission pour les notifications push
export const requestPushNotificationsPermission = async () => {
  try {
    
    const permStatus = await PushNotifications.requestPermissions();
    if (permStatus.receive === 'granted') {
      console.log('Permission accordée pour les notifications.');
      await PushNotifications.register();

      // Récupérer le token FCM (Firebase Cloud Messaging)
      const token = await FirebaseMessaging.getToken();
      console.log('Token FCM :', token.token);

      // Envoi du token au backend pour l'associer à l'utilisateur ou à l'appareil
      await fetch('https://5b55-41-74-213-76.ngrok-free.app/api/save-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token.token }),
      })
      .then(response => {
        if (response.ok) {
          console.log('Token envoyé au backend avec succès.');
        } else {
          console.error('Erreur lors de l\'envoi du token au backend. Statut:', response.status);
        }
      })
      .catch(err => {
        console.error('Erreur lors de l\'envoi du token au backend :', err);
      });

    } else {
      console.log('Permission refusée pour les notifications.');
    }
  } catch (err) {
    console.error('Erreur lors de la demande de permission pour les notifications :', err);
  }
};

// Écoute des notifications et affichage de la notification dans l'application
export const setupNotificationListener = async (onNotificationReceived: (notification: PushNotificationSchema) => void) => {
  console.log('Le listener pour les notifications push a été initialisé.');

  // Listener pour la réception du token
  PushNotifications.addListener('registration', token => {
    console.info('Registration token: ', token.value);
  });

  // Listener pour les erreurs d'enregistrement
  PushNotifications.addListener('registrationError', err => {
    console.error('Registration error: ', err.error);
  });

  // Listener pour les notifications reçues
  PushNotifications.addListener('pushNotificationReceived', async (notification) => {
    console.log('Notification reçue dans le listener :', JSON.stringify(notification));

    // Passer la notification reçue au callback pour mettre à jour l'interface utilisateur
    onNotificationReceived(notification);

 
  });

  // Listener pour les actions effectuées sur une notification
  PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
    console.log('Action effectuée sur la notification :', JSON.stringify(notification));
  });
};

// Utiliser le listener dans un composant React
export const usePushNotificationListener = (onNotificationReceived: (notification: PushNotificationSchema) => void) => {
  useEffect(() => {
    setupNotificationListener(onNotificationReceived);
  }, [onNotificationReceived]);
};
// Obtenir les notifications livrées
export const getDeliveredNotifications = async () => {
  try {
    const notificationList = await PushNotifications.getDeliveredNotifications();
    console.log('Notifications livrées :',JSON.stringify(notificationList), notificationList);
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications livrées :', error);
  }
};
