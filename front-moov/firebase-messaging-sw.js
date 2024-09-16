importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyCRTFcprY20hKw9_v-sg1FN_l2qMzEYX60",
  authDomain: "moov-bc04a.firebaseapp.com",
  projectId: "moov-bc04a",
  storageBucket: "moov-bc04a.appspot.com",
  messagingSenderId: "1067665666280",
  appId: "1:1067665666280:android:15c23c1eb82a71d5e6d95d",
  // databaseURL: "https://moov-bc04a-default-rtdb.firebaseio.com",
  measurementId: "G-YMSC3YP7HC"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
