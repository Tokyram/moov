// src/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getMessaging, onMessage, getToken } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyCRTFcprY20hKw9_v-sg1FN_l2qMzEYX60",
  authDomain: "moov-bc04a.firebaseapp.com",
  projectId: "moov-bc04a",
  storageBucket: "moov-bc04a.appspot.com",
  messagingSenderId: "1067665666280",
  appId: "1:1067665666280:android:15c23c1eb82a71d5e6d95d",
  // databaseURL: "https://moov-bc04a-default-rtdb.firebaseio.com",
  measurementId: "G-YMSC3YP7HC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestFirebaseToken = async () => {
  console.log('Demande de token FCM en cours...');

  try {
    if ('serviceWorker' in navigator) {
      // Register the service worker
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('Service Worker registered with scope:', registration.scope);

      navigator.serviceWorker.ready.then((reg) => {
        console.log('Service Worker is active:', reg);
      }).catch((error) => {
        console.error('Service Worker is not active:', error);
      });
      
      // Get FCM token
      const currentToken = await getToken(messaging, { vapidKey: 'BDY4LgNytQ_izn2_Dg1I_kbcqVX4auloyb4OV5IWmX1SBQOPgbTLjD-Qg0q_4ExTRtPS-4BFy4IvD54kZz8y7PU' });
      if (currentToken) {
        console.log('FCM Token:', currentToken);

        // Send token to backend via HTTP POST
        await fetch('https://localhost:3000/api/save-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: currentToken }),
        });
        console.log('Token envoyé avec succès au backend.');
      } else {
        console.log('Aucun token de notification disponible.');
      }
    } else {
      console.log('Service Workers are not supported in this browser.');
    }
  } catch (err) {
    console.error('Erreur lors de la récupération du token.', err);
  }
};

export const setupNotificationListener = (onNotification: (payload: any) => void) => {
  onMessage(messaging, (payload) => {
    console.log('Message reçu. ', payload);
    onNotification(payload);
  });
};