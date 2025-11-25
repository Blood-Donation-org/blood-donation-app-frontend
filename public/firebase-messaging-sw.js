/* eslint-disable no-undef */
// Firebase Service Worker for Background Push Notifications
// This file handles background push notifications when the app is not in focus

// Import the Firebase scripts needed for messaging
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYoneYWVChCstCD6PMFjd5biJ8HJZh7Io",
  authDomain: "blood-donation-fc136.firebaseapp.com",
  projectId: "blood-donation-fc136",
  storageBucket: "blood-donation-fc136.firebasestorage.app",
  messagingSenderId: "439502128204",
  appId: "1:439502128204:web:9dc74e77dabbc3d77220e9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  // Extract notification data
  const notificationTitle = payload.notification?.title || 'Blood Donation Alert';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: payload.notification?.icon || '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: 'blood-donation-notification',
    requireInteraction: true,
    data: payload.data || {},
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/view-icon.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/dismiss-icon.png'
      }
    ]
  };

  // Show notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification clicked:', event);

  const notification = event.notification;
  const action = event.action;

  if (action === 'dismiss') {
    notification.close();
    return;
  }

  // Default action or 'view' action
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if app is already open
      for (const client of clientList) {
        if (client.url.includes('localhost:5173') && 'focus' in client) {
          notification.close();
          return client.focus();
        }
      }

      // If app is not open, open it
      notification.close();
      return clients.openWindow('/');
    })
  );
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('[firebase-messaging-sw.js] Notification closed:', event);
  
  // Track notification close analytics if needed
  // You can send analytics data here
});