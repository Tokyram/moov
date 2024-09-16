<<<<<<< Updated upstream
=======
// src/services/pushNotifications.ts
>>>>>>> Stashed changes
import { PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { LocalNotifications } from '@capacitor/local-notifications';
import { useEffect } from 'react';

// Demander la permission pour les notifications push
export const requestPushNotificationsPermission = async () => {
  try {
    // Vérifier les permissions actuelles
    let permStatus = await PushNotifications.checkPermissions();

    // Demander les permissions si nécessaire
    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    // Vérifier si la permission a été accordée
    if (permStatus.receive === 'granted') {
      console.log('Permission accordée pour les notifications.');

      // Inscription pour recevoir les notifications
      await PushNotifications.register();

      // Récupérer le token FCM (Firebase Cloud Messaging)
      const token = await FirebaseMessaging.getToken();
      console.log('Token FCM :', token.token);

      // Envoi du token au backend pour l'associer à l'utilisateur ou à l'appareil
<<<<<<< Updated upstream
      await fetch('https://5b89-102-18-34-151.ngrok-free.app/api/save-token', {
=======
      await fetch('https://488f-102-18-34-151.ngrok-free.app/api/save-token', {
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
// Écoute des notifications et affichage de la notification dans l'application
export const setupNotificationListener = async (onNotificationReceived: (notification: PushNotificationSchema) => void) => {
  console.log('Le listener pour les notifications push a été initialisé.');

  // Listener pour la réception du token
  PushNotifications.addListener('registration', token => {
    console.info('Registration token: ', token.value);
=======
// Écoute des notifications
// export const setupNotificationListener = () => {
//   PushNotifications.addListener('pushNotificationReceived', (notification) => {
//     console.log('Notification reçue :', notification);
//     alert('Notification reçue : ' + JSON.stringify(notification));
//   });

//   PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
//     console.log('Action sur la notification :', notification);
//     alert('Action sur la notification : ' + JSON.stringify(notification));
//   });
// };
export const setupNotificationListener = (onNotificationReceived: (notification: PushNotificationSchema) => void) => {
  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('Notification reçue :', notification);
    onNotificationReceived(notification); // Appel de la fonction callback
>>>>>>> Stashed changes
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

    // Créer et afficher une notification locale
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: notification.title || 'Nouvelle notification',
            body: notification.body || 'Vous avez reçu une nouvelle notification.',
            id: Date.now(), // ID unique pour éviter les conflits
            schedule: { at: new Date(Date.now() + 1000) }, // Délai d'une seconde
          },
        ],
      });
      console.log('Notification locale créée et affichée.');
    } catch (error) {
      console.error('Erreur lors de la création de la notification locale :', error);
    }
  });

  // Listener pour les actions effectuées sur une notification
  PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
<<<<<<< Updated upstream
    console.log('Action effectuée sur la notification :', JSON.stringify(notification));
=======
    console.log('Action sur la notification :', notification);
    // Ici, vous pouvez gérer les actions effectuées par l'utilisateur
>>>>>>> Stashed changes
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
    console.log('Notifications livrées :', notificationList);
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications livrées :', error);
  }
};
