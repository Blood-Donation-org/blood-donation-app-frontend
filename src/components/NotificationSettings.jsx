import React, { useState, useEffect } from 'react';
import usePushNotifications from '../hooks/usePushNotifications';
import '../styles/NotificationSettings.css';

const NotificationSettings = () => {
  const {
    isPermissionGranted,
    notificationPreferences,
    isLoading,
    error,
    requestPermission,
    updatePreferences,
    sendTest,
    disableNotifications
  } = usePushNotifications();

  const [localPreferences, setLocalPreferences] = useState({
    pushNotifications: true,
    bloodRequestNotifications: true,
    campNotifications: true,
    systemNotifications: true
  });

  const [testLoading, setTestLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Update local preferences when they're loaded
  useEffect(() => {
    if (notificationPreferences) {
      setLocalPreferences(notificationPreferences);
    }
  }, [notificationPreferences]);

  // Clear feedback after 3 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handlePermissionRequest = async () => {
    const success = await requestPermission();
    if (success) {
      setFeedback('Notifications enabled successfully! 🔔');
    } else {
      setFeedback('Failed to enable notifications. Please check your browser settings.');
    }
  };

  const handleDisableNotifications = async () => {
    await disableNotifications();
    setFeedback('Notifications disabled successfully.');
  };

  const handlePreferenceChange = async (key, value) => {
    const newPreferences = {
      ...localPreferences,
      [key]: value
    };

    setLocalPreferences(newPreferences);
    
    const success = await updatePreferences({ [key]: value });
    if (success) {
      setFeedback('Preferences updated successfully! ✅');
    } else {
      // Revert on failure
      setLocalPreferences(localPreferences);
      setFeedback('Failed to update preferences.');
    }
  };

  const handleSendTest = async () => {
    setTestLoading(true);
    const success = await sendTest(
      '🧪 Test Notification',
      'If you can see this, push notifications are working perfectly!'
    );
    
    if (success) {
      setFeedback('Test notification sent! Check your notifications.');
    } else {
      setFeedback('Failed to send test notification.');
    }
    setTestLoading(false);
  };

  return (
    <div className="notification-settings-container">
      <div className="notification-settings-header">
        <h3>🔔 Push Notification Settings</h3>
        <p>Manage your push notification preferences</p>
      </div>

      {error && (
        <div className="notification-error">
          <span>⚠️ Error: {error}</span>
        </div>
      )}

      {feedback && (
        <div className="notification-feedback">
          <span>{feedback}</span>
        </div>
      )}

      <div className="notification-settings-content">
        {/* Permission Status */}
        <div className="permission-section">
          <div className="permission-status">
            <span className={`status-indicator ${isPermissionGranted ? 'granted' : 'denied'}`}>
              {isPermissionGranted ? '🟢' : '🔴'}
            </span>
            <span className="status-text">
              Push Notifications: {isPermissionGranted ? 'Enabled' : 'Disabled'}
            </span>
          </div>

          <div className="permission-actions">
            {!isPermissionGranted ? (
              <button 
                className="btn btn-enable-notifications"
                onClick={handlePermissionRequest}
                disabled={isLoading}
              >
                {isLoading ? 'Enabling...' : 'Enable Notifications'}
              </button>
            ) : (
              <div className="permission-actions-enabled">
                <button 
                  className="btn btn-test-notification"
                  onClick={handleSendTest}
                  disabled={testLoading || isLoading}
                >
                  {testLoading ? 'Sending...' : 'Send Test'}
                </button>
                <button 
                  className="btn btn-disable-notifications"
                  onClick={handleDisableNotifications}
                  disabled={isLoading}
                >
                  Disable
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Notification Preferences */}
        {isPermissionGranted && notificationPreferences && (
          <div className="preferences-section">
            <h4>Notification Types</h4>
            <div className="preference-options">
              <div className="preference-item">
                <label className="preference-label">
                  <input
                    type="checkbox"
                    checked={localPreferences.pushNotifications}
                    onChange={(e) => handlePreferenceChange('pushNotifications', e.target.checked)}
                    disabled={isLoading}
                  />
                  <span className="preference-title">
                    📱 Push Notifications
                  </span>
                  <span className="preference-description">
                    Receive push notifications on this device
                  </span>
                </label>
              </div>

              <div className="preference-item">
                <label className="preference-label">
                  <input
                    type="checkbox"
                    checked={localPreferences.bloodRequestNotifications}
                    onChange={(e) => handlePreferenceChange('bloodRequestNotifications', e.target.checked)}
                    disabled={isLoading || !localPreferences.pushNotifications}
                  />
                  <span className="preference-title">
                    🩸 Blood Request Notifications
                  </span>
                  <span className="preference-description">
                    Get notified about new blood requests and updates
                  </span>
                </label>
              </div>

              <div className="preference-item">
                <label className="preference-label">
                  <input
                    type="checkbox"
                    checked={localPreferences.campNotifications}
                    onChange={(e) => handlePreferenceChange('campNotifications', e.target.checked)}
                    disabled={isLoading || !localPreferences.pushNotifications}
                  />
                  <span className="preference-title">
                    🏕️ Camp Notifications
                  </span>
                  <span className="preference-description">
                    Receive updates about blood donation camps
                  </span>
                </label>
              </div>

              <div className="preference-item">
                <label className="preference-label">
                  <input
                    type="checkbox"
                    checked={localPreferences.systemNotifications}
                    onChange={(e) => handlePreferenceChange('systemNotifications', e.target.checked)}
                    disabled={isLoading || !localPreferences.pushNotifications}
                  />
                  <span className="preference-title">
                    🔔 System Notifications
                  </span>
                  <span className="preference-description">
                    Important system updates and announcements
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Information Section */}
        <div className="info-section">
          <h4>About Push Notifications</h4>
          <ul className="info-list">
            <li>🔔 Receive real-time notifications even when the app is closed</li>
            <li>🩸 Get instant alerts for urgent blood requests</li>
            <li>🏕️ Stay updated about blood donation camps in your area</li>
            <li>⚙️ Manage your preferences anytime</li>
            <li>🔒 Your notification preferences are securely stored</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;