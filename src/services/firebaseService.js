import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDYoneYWVChCstCD6PMFjd5biJ8HJZh7Io",
  authDomain: "blood-donation-fc136.firebaseapp.com",
  projectId: "blood-donation-fc136",
  storageBucket: "blood-donation-fc136.firebasestorage.app",
  messagingSenderId: "439502128204",
  appId: "1:439502128204:web:9dc74e77dabbc3d77220e9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
let messaging = null;

// Check if messaging is supported
const initializeMessaging = async () => {
  try {
    const supported = await isSupported();
    if (supported) {
      messaging = getMessaging(app);
      console.log('Firebase Messaging initialized successfully');
    } else {
      console.log('Firebase Messaging is not supported in this browser');
    }
  } catch (error) {
    console.error('Error initializing Firebase Messaging:', error);
  }
};

// Initialize messaging
initializeMessaging();

/**
 * Request permission for notifications and get FCM token
 * @param {string} vapidKey - VAPID key for web push notifications
 * @returns {Promise<string|null>} - FCM token or null if failed
 */
export const requestNotificationPermission = async (vapidKey = null) => {
  try {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      throw new Error('This browser does not support notifications');
    }

    // Check if messaging is initialized
    if (!messaging) {
      throw new Error('Firebase Messaging not supported or initialized');
    }

    // Request permission
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Notification permission granted');
      
      // Get registration token
      const token = await getToken(messaging, {
        vapidKey: vapidKey || 'YOUR_VAPID_KEY_HERE' // Replace with your VAPID key
      });
      
      if (token) {
        console.log('FCM Token:', token);
        return token;
      } else {
        throw new Error('No registration token available');
      }
    } else {
      throw new Error('Notification permission denied');
    }
  } catch (error) {
    console.error('Error getting notification permission:', error);
    return null;
  }
};

/**
 * Set up foreground message listener
 * @param {Function} callback - Callback function to handle received messages
 */
export const onForegroundMessage = (callback) => {
  if (!messaging) {
    console.error('Firebase Messaging not initialized');
    return () => {};
  }

  const unsubscribe = onMessage(messaging, (payload) => {
    console.log('Message received in foreground:', payload);
    
    // Extract notification data
    const notification = {
      title: payload.notification?.title || 'New Notification',
      body: payload.notification?.body || 'You have a new notification',
      icon: payload.notification?.icon || '/icon-192x192.png',
      data: payload.data || {}
    };

    // Call the callback function
    if (callback && typeof callback === 'function') {
      callback(notification, payload);
    }

    // Show browser notification if page is not focused
    if (document.hidden || document.visibilityState === 'hidden') {
      showBrowserNotification(notification);
    }
  });

  return unsubscribe;
};

/**
 * Show browser notification
 * @param {Object} notification - Notification data
 */
const showBrowserNotification = (notification) => {
  try {
    if (Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.body,
        icon: notification.icon,
        badge: '/badge-72x72.png',
        tag: 'blood-donation-notification',
        requireInteraction: true,
        data: notification.data
      });

      // Handle notification click
      browserNotification.onclick = () => {
        window.focus();
        browserNotification.close();
        
        // Navigate to notification-related page if data contains URL
        if (notification.data && notification.data.url) {
          window.location.href = notification.data.url;
        }
      };

      // Auto close after 10 seconds
      setTimeout(() => {
        browserNotification.close();
      }, 10000);
    }
  } catch (error) {
    console.error('Error showing browser notification:', error);
  }
};

/**
 * Register FCM token with backend
 * @param {string} token - FCM token
 * @param {string} userId - User ID
 * @param {string} deviceInfo - Device information
 * @returns {Promise<boolean>} - Success status
 */
export const registerTokenWithBackend = async (token, userId, deviceInfo = null) => {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
    const response = await fetch(`${API_BASE_URL}/notifications/register-fcm-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        fcmToken: token,
        deviceInfo: deviceInfo || navigator.userAgent
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('FCM token registered with backend successfully');
      return true;
    } else {
      console.error('Failed to register FCM token with backend:', data);
      return false;
    }
  } catch (error) {
    console.error('Error registering FCM token with backend:', error);
    return false;
  }
};

/**
 * Remove FCM token from backend
 * @param {string} token - FCM token
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} - Success status
 */
export const removeTokenFromBackend = async (token, userId) => {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
    const response = await fetch(`${API_BASE_URL}/notifications/remove-fcm-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        fcmToken: token
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('FCM token removed from backend successfully');
      return true;
    } else {
      console.error('Failed to remove FCM token from backend:', data);
      return false;
    }
  } catch (error) {
    console.error('Error removing FCM token from backend:', error);
    return false;
  }
};

/**
 * Get notification preferences
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} - Notification preferences or null
 */
export const getNotificationPreferences = async (userId) => {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
    const response = await fetch(`${API_BASE_URL}/notifications/preferences/${userId}`);
    const data = await response.json();
    
    if (response.ok) {
      return data.preferences;
    } else {
      console.error('Failed to get notification preferences:', data);
      return null;
    }
  } catch (error) {
    console.error('Error getting notification preferences:', error);
    return null;
  }
};

/**
 * Update notification preferences
 * @param {string} userId - User ID
 * @param {Object} preferences - Notification preferences
 * @returns {Promise<boolean>} - Success status
 */
export const updateNotificationPreferences = async (userId, preferences) => {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
    const response = await fetch(`${API_BASE_URL}/notifications/preferences/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences)
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('Notification preferences updated successfully');
      return true;
    } else {
      console.error('Failed to update notification preferences:', data);
      return false;
    }
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    return false;
  }
};

/**
 * Send test push notification
 * @param {string} userId - User ID
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @returns {Promise<boolean>} - Success status
 */
export const sendTestNotification = async (userId, title = null, message = null) => {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
    const response = await fetch(`${API_BASE_URL}/notifications/test-push`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        title: title,
        message: message
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('Test notification sent successfully');
      return true;
    } else {
      console.error('Failed to send test notification:', data);
      return false;
    }
  } catch (error) {
    console.error('Error sending test notification:', error);
    return false;
  }
};

export default app;