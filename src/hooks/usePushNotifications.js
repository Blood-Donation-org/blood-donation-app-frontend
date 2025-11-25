import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import {
  requestNotificationPermission,
  onForegroundMessage,
  registerTokenWithBackend,
  removeTokenFromBackend,
  getNotificationPreferences,
  updateNotificationPreferences,
  sendTestNotification
} from '../services/firebaseService';

/**
 * Custom hook for managing Firebase push notifications
 * @returns {Object} Notification methods and state
 */
const usePushNotifications = () => {
  const { currentUser } = useContext(UserContext);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [fcmToken, setFcmToken] = useState(null);
  const [notificationPreferences, setNotificationPreferences] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize push notifications
  const initializePushNotifications = async () => {
    if (!currentUser || !currentUser._id) {
      console.log('No current user, skipping push notification initialization');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check current notification permission
      const permission = Notification.permission;
      setIsPermissionGranted(permission === 'granted');

      if (permission === 'granted') {
        // Get FCM token
        const token = await requestNotificationPermission();
        if (token) {
          setFcmToken(token);
          
          // Register token with backend
          const registered = await registerTokenWithBackend(
            token, 
            currentUser._id,
            getBrowserInfo()
          );
          
          if (registered) {
            console.log('Push notifications initialized successfully');
          }
        }
      }

      // Get notification preferences
      const preferences = await getNotificationPreferences(currentUser._id);
      if (preferences) {
        setNotificationPreferences(preferences);
      }
    } catch (error) {
      console.error('Error initializing push notifications:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Request notification permission
  const requestPermission = async () => {
    if (!currentUser || !currentUser._id) {
      setError('No user logged in');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = await requestNotificationPermission();
      if (token) {
        setFcmToken(token);
        setIsPermissionGranted(true);
        
        // Register with backend
        const registered = await registerTokenWithBackend(
          token,
          currentUser._id,
          getBrowserInfo()
        );
        
        if (registered) {
          console.log('Permission granted and token registered');
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error requesting permission:', error);
      setError(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update user notification preferences
  const updatePreferences = async (newPreferences) => {
    if (!currentUser || !currentUser._id) {
      setError('No user logged in');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const success = await updateNotificationPreferences(currentUser._id, newPreferences);
      if (success) {
        setNotificationPreferences(prev => ({ ...prev, ...newPreferences }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating preferences:', error);
      setError(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Send test notification
  const sendTest = async (title = null, message = null) => {
    if (!currentUser || !currentUser._id) {
      setError('No user logged in');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const success = await sendTestNotification(currentUser._id, title, message);
      return success;
    } catch (error) {
      console.error('Error sending test notification:', error);
      setError(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Disable notifications
  const disableNotifications = async () => {
    if (!currentUser || !currentUser._id || !fcmToken) {
      return;
    }

    try {
      await removeTokenFromBackend(fcmToken, currentUser._id);
      setFcmToken(null);
      setIsPermissionGranted(false);
      console.log('Notifications disabled successfully');
    } catch (error) {
      console.error('Error disabling notifications:', error);
      setError(error.message);
    }
  };

  // Get browser information
  const getBrowserInfo = () => {
    const userAgent = navigator.userAgent;
    let browserName = "Unknown";
    
    if (userAgent.indexOf("Firefox") > -1) {
      browserName = "Mozilla Firefox";
    } else if (userAgent.indexOf("Chrome") > -1) {
      browserName = "Google Chrome";
    } else if (userAgent.indexOf("Safari") > -1) {
      browserName = "Safari";
    } else if (userAgent.indexOf("Edge") > -1) {
      browserName = "Microsoft Edge";
    }
    
    return `${browserName} - ${navigator.platform}`;
  };

  // Set up foreground message listener
  useEffect(() => {
    let unsubscribe = null;

    if (isPermissionGranted && currentUser) {
      unsubscribe = onForegroundMessage((notification, payload) => {
        console.log('Foreground notification received:', notification);
        
        // You can customize this behavior
        // For example, show a toast notification or update UI
        
        // Create a custom event that other components can listen to
        const customEvent = new CustomEvent('foregroundNotification', {
          detail: { notification, payload }
        });
        window.dispatchEvent(customEvent);
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isPermissionGranted, currentUser]);

  // Initialize on component mount
  useEffect(() => {
    if (currentUser && currentUser._id) {
      initializePushNotifications();
    }
  }, [currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Clean up any resources if needed
    };
  }, []);

  return {
    // State
    isPermissionGranted,
    fcmToken,
    notificationPreferences,
    isLoading,
    error,
    
    // Methods
    requestPermission,
    updatePreferences,
    sendTest,
    disableNotifications,
    initializePushNotifications
  };
};

export default usePushNotifications;