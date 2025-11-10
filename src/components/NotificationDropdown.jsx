import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import bell from '../assets/nav_bar/bell-icon.png';
import { API_ENDPOINTS } from '../config/api';
import { UserContext } from '../context/UserContext';
import '../styles/Navbar.css';
import '../styles/Notification.css';

const NotificationDropdown = ({ userRole }) => {
  const { currentUser } = useContext(UserContext);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastUserId, setLastUserId] = useState(null);

  // Clear notifications when user changes
  useEffect(() => {
    const currentUserId = currentUser?.id;
    if (currentUserId !== lastUserId) {
      console.log('User changed, clearing notifications');
      console.log('Previous user:', lastUserId);
      console.log('Current user:', currentUserId);
      setNotifications([]);
      setUnreadCount(0);
      setLastUserId(currentUserId);
    }
  }, [currentUser?.id, lastUserId]);

  useEffect(() => {
    const fetchNotifications = async () => {
      // Debug logging
      console.log('=== NOTIFICATION FETCH DEBUG ===');
      console.log('Current User:', currentUser);
      console.log('Current User Structure:', JSON.stringify(currentUser, null, 2));
      console.log('User ID:', currentUser?.id);
      console.log('User Role:', userRole);
      console.log('localStorage userData:', JSON.parse(localStorage.getItem('userData') || 'null'));
      
      // Check if we have the right user structure
      if (currentUser) {
        console.log('Current user keys:', Object.keys(currentUser));
        console.log('User ID type:', typeof currentUser.id);
        console.log('User ID value:', currentUser.id);
      }
      
      // Only fetch notifications if user is logged in - REMOVED hardcoded test user
      if (!currentUser || !currentUser.id) {
        console.log('No user or user ID, skipping notification fetch');
        console.log('currentUser exists:', !!currentUser);
        console.log('currentUser.id exists:', !!currentUser?.id);
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      const userId = currentUser.id;
      console.log('Using logged-in user ID:', userId);
      console.log('User ID type:', typeof userId);
      console.log('User ID length:', userId ? userId.length : 'undefined');
      console.log('Expected user ID from database:', '691165087324ecf759394eb');
      console.log('Current user ID matches database?', userId === '691165087324ecf759394eb');

      try {
        // Fetch notifications specific to the current user
        const apiUrl = API_ENDPOINTS.NOTIFICATION.GET_BY_USER(userId);
        console.log('Fetching notifications from:', apiUrl);
        
        const response = await axios.get(apiUrl);
        console.log('API Response Status:', response.status);
        console.log('API Response Data:', response.data);
        
        const userNotifications = response.data.notifications || [];
        console.log('User notifications count:', userNotifications.length);
        console.log('User notifications:', userNotifications);
        
        // Verify that ALL notifications belong to current user
        const incorrectNotifications = userNotifications.filter(notif => 
          notif.user && notif.user._id && notif.user._id.toString() !== userId.toString()
        );
        
        if (incorrectNotifications.length > 0) {
          console.error('🚨 SECURITY ISSUE: Found notifications that do NOT belong to current user:');
          console.error('Current user ID:', userId);
          console.error('Incorrect notifications:', incorrectNotifications);
        } else {
          console.log('✅ All notifications belong to current user');
        }
        
        setNotifications(userNotifications);
        const unread = userNotifications.filter(notif => notif.status !== 'read').length;
        setUnreadCount(unread);
        console.log('Unread count:', unread);
        
      } catch (error) {
        console.error('=== API ERROR ===');
        console.error('Error fetching notifications:', error.message);
        console.error('Error code:', error.code);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        
        setNotifications([]);
        setUnreadCount(0);
      }
    };

    fetchNotifications();
    // Poll for new notifications every 30s if user is logged in
    if (currentUser && currentUser.id) {
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [currentUser, userRole]);

  // Remove loadNotifications and sample notification logic

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };


  const getUrgencyClass = (urgency) => {
    switch (urgency) {
      case 'critical': return 'critical';
      case 'urgent': return 'urgent';
      default: return 'normal';
    }
  };

  const toggleNotifications = async () => {
    setIsNotificationOpen(!isNotificationOpen);
    
    // Mark unread notifications as read when opening the dropdown
    if (!isNotificationOpen && unreadCount > 0) {
      try {
        const unreadNotifications = notifications.filter(notif => notif.status !== 'read');
        
        // Mark each unread notification as read
        const markReadPromises = unreadNotifications.map(notif => 
          axios.patch(API_ENDPOINTS.NOTIFICATION.MARK_READ(notif.id))
        );
        
        await Promise.all(markReadPromises);
        
        // Update local state
        setNotifications(prev => prev.map(notif => ({
          ...notif,
          status: 'read'
        })));
        setUnreadCount(0);
      } catch (error) {
        console.error('Error marking notifications as read:', error);
      }
    }
  };

  const clearAllNotifications = async () => {
    if (!currentUser || !currentUser.id) return;

    try {
      // Delete all notifications for the current user
      const deletePromises = notifications.map(notif => 
        axios.delete(API_ENDPOINTS.NOTIFICATION.DELETE(notif.id))
      );
      
      await Promise.all(deletePromises);
      
      // Update local state
      setNotifications([]);
      setUnreadCount(0);
      setIsNotificationOpen(false);
    } catch (error) {
      console.error('Error clearing notifications:', error);
      // Still update local state even if API calls fail
      setNotifications([]);
      setUnreadCount(0);
      setIsNotificationOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.notification-container')) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Render notification from backend API
  const renderNotificationContent = (notification) => {
    // For doctor: show only confirmation status notifications
    if (userRole === 'doctor' && notification.relatedRequest) {
      const conf = notification.relatedRequest.confirmationStatus;
      if (conf === 'confirmed' || conf === 'unconfirmed' || conf === 'rejected') {
        return (
          <div className="notification-card">
            <div className="notification-card-header">
              <span className="notification-card-icon">🩸</span>
              <span className="notification-card-title">
                {notification.relatedRequest.patientName}
              </span>
              <span className={`notification-card-bloodtype bloodtype-${notification.relatedRequest.bloodType.replace('+','plus').replace('-','minus')}`}>{notification.relatedRequest.bloodType}</span>
              <span className="notification-card-time">{formatTimeAgo(notification.createdAt)}</span>
            </div>
            <div className="notification-card-body">
              <span className="notification-card-message">
                Request for <strong>{notification.relatedRequest.unitsRequired}</strong> units in <strong>{notification.relatedRequest.wardNumber}</strong> is
                <span className={`confirm-${conf}`}> {conf.charAt(0).toUpperCase() + conf.slice(1)}</span>.
              </span>
            </div>
            <div className="notification-card-details">
              <span className={`notification-card-detail status-${notification.relatedRequest.status}`}>{notification.relatedRequest.status}</span>
              <span className={`notification-card-detail confirm-${conf}`}>{conf.charAt(0).toUpperCase() + conf.slice(1)}</span>
            </div>
          </div>
        );
      }
      return null;
    }
    // For admin: keep existing style
    // Modern card style notification
    return (
      <div className="notification-card">
        <div className="notification-card-header">
          <span className="notification-card-icon">
            {notification.type === 'blood-request' ? '🩸' : '🔔'}
          </span>
          <span className="notification-card-title">
            {notification.relatedRequest?.patientName || notification.user?.fullName || 'Unknown'}
          </span>
          {notification.relatedRequest?.bloodType && (
            <span className={`notification-card-bloodtype bloodtype-${notification.relatedRequest.bloodType.replace('+','plus').replace('-','minus')}`}>{notification.relatedRequest.bloodType}</span>
          )}
          <span className="notification-card-time">{formatTimeAgo(notification.createdAt)}</span>
        </div>
        <div className="notification-card-body">
          <span className="notification-card-message">{notification.message}</span>
        </div>
        {notification.relatedRequest && (
          <div className="notification-card-details">
            <span className="notification-card-detail"><strong>Units:</strong> {notification.relatedRequest.unitsRequired}</span>
            <span className="notification-card-detail"><strong>Ward:</strong> {notification.relatedRequest.wardNumber}</span>
            <span className={`notification-card-detail status-${notification.relatedRequest.status}`}>{notification.relatedRequest.status}</span>
            <span className={`notification-card-detail confirm-${notification.relatedRequest.confirmationStatus}`}>{notification.relatedRequest.confirmationStatus}</span>
          </div>
        )}
      </div>
    );
  };

  const getNotificationHeaderTitle = () => {
    console.log('getNotificationHeaderTitle - UserRole:', userRole);
    switch (userRole) {
      case 'admin': return 'Blood Requests';
      case 'doctor': return 'Request Updates';
      default: return 'Notifications';
    }
  };

  // Show donation_reminder only for user role 'user', exclude for admin and doctor
  const getFilteredNotifications = () => {
    console.log('Filtering notifications. UserRole:', userRole, 'Total notifications:', notifications.length);
    console.log('All notifications types:', notifications.map(n => n.type));
    
    // TEMPORARILY SHOW ALL NOTIFICATIONS FOR DEBUGGING
    console.log('Returning all notifications for debugging');
    return notifications;
    
    // Original filtering logic (commented out for debugging)
    /*
    if (userRole === 'user') {
      const filtered = notifications.filter(n => n.type === 'donation_reminder' || n.type === 'general' || n.type === 'blood-request');
      console.log('Filtered for user role:', filtered.length);
      return filtered;
    }
    // For admin and doctor, exclude donation_reminder notifications  
    const filtered = notifications.filter(n => n.type !== 'donation_reminder');
    console.log('Filtered for admin/doctor role:', filtered.length);
    return filtered;
    */
  };

  return (
    <div className="notification-container">
      <button 
        className={`notification-btn ${unreadCount > 0 ? 'has-notifications' : ''}`}
        onClick={toggleNotifications}
      >
        <img src={bell} alt="bell icon" className="bell-icon"/>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>
      {isNotificationOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>{getNotificationHeaderTitle()}</h3>           
            {notifications.length > 0 && (
              <button 
                className="clear-btn"
                onClick={clearAllNotifications}
              >
                Clear All
              </button>
            )}
          </div>
          <div className="notification-list">
            {getFilteredNotifications().length === 0 ? (
              <div className="no-notifications">
                <p>No notifications at the moment</p>
              </div>
            ) : (
              getFilteredNotifications().map((notification) => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${
                    userRole === 'admin' 
                      ? getUrgencyClass(notification.urgency) 
                      : userRole === 'doctor'
                      ? notification.type.replace('request_', '')
                      : 'donation-reminder'
                  } ${!notification.isRead ? 'unread' : ''}`}
                >
                  {renderNotificationContent(notification)}
                </div>
              ))
            )}
          </div>
          {notifications.length > 0 && userRole === 'admin' && (
            <div className="notification-footer">
              <Link to="/request-report" className="view-all-btn">
                View All Requests
              </Link>
            </div>
          )}
          {notifications.length > 0 && userRole === 'doctor' && (
            <div className="notification-footer">
              <Link to="/doctor-requests" className="view-all-btn">
                View My Requests
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;