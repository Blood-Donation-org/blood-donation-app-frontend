import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import bell from '../assets/nav_bar/bell-icon.png';
import { API_ENDPOINTS } from '../config/api';
import { UserContext } from '../context/UserContext';
import '../styles/Navbar.css';
import '../styles/Notification.css';

// Add doctor notification styles
const doctorNotificationStyles = `
  .doctor-notification {
    border-left: 4px solid #007bff;
  }
  .status-message {
    font-weight: bold;
    padding: 8px 0;
    font-size: 14px;
  }
  .status-approved {
    color: #28a745;
  }
  .status-rejected {
    color: #dc3545;
  }
  .status-not-available {
    color: #ffc107;
  }
  .request-details {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 12px;
    color: #666;
    margin-top: 8px;
  }
  .request-details span {
    padding: 2px 0;
  }
  .urgency-critical {
    color: #dc3545;
  }
  .urgency-urgent {
    color: #fd7e14;
  }
  .urgency-normal {
    color: #28a745;
  }
`;

// Inject styles
if (typeof document !== 'undefined' && !document.getElementById('doctor-notification-styles')) {
  const style = document.createElement('style');
  style.id = 'doctor-notification-styles';
  style.textContent = doctorNotificationStyles;
  document.head.appendChild(style);
}

const NotificationDropdown = ({ userRole }) => {
  const { currentUser } = useContext(UserContext);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastUserId, setLastUserId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to manually trigger notification refresh
  const refreshNotifications = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Expose refresh function globally
  useEffect(() => {
    globalThis.refreshNotifications = refreshNotifications;
    return () => {
      delete globalThis.refreshNotifications;
    };
  }, []);

  // Clear notifications when user changes
  useEffect(() => {
    const currentUserId = currentUser?.id;
    if (currentUserId !== lastUserId) {
      setNotifications([]);
      setUnreadCount(0);
      setLastUserId(currentUserId);
    }
  }, [currentUser?.id, lastUserId]);

  useEffect(() => {
    const fetchNotifications = async () => {
      // Only fetch notifications if user is logged in
      if (!currentUser || !currentUser.id) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      const userId = currentUser.id;

      try {
        // Fetch notifications specific to the current user
        const apiUrl = API_ENDPOINTS.NOTIFICATION.GET_BY_USER(userId);
        
        const response = await axios.get(apiUrl);
        
        const userNotifications = response.data.notifications || [];
        
        setNotifications(userNotifications);
        const unread = userNotifications.filter(notif => notif.status !== 'read').length;
        setUnreadCount(unread);
        
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotifications([]);
        setUnreadCount(0);
      }
    };

    fetchNotifications();
    // Poll for new notifications every 5s if user is logged in (reduced for better responsiveness)
    if (currentUser && currentUser.id) {
      const interval = setInterval(fetchNotifications, 5000);
      return () => clearInterval(interval);
    }
  }, [currentUser, userRole, refreshTrigger]);

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
        // Error handling for marking notifications as read
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
    // For doctor: show only status update notifications
    if (userRole === 'doctor') {
      const request = notification.relatedRequest;
      if (!request) return null;
      
      const getStatusMessage = (status) => {
        switch (status) {
          case 'approved': return 'Request Approved';
          case 'rejected': return 'Request Rejected';
          case 'not_available': return 'Blood Not Available';
          default: return 'Status Updated';
        }
      };
      
      const getStatusClass = (status) => {
        switch (status) {
          case 'approved': return 'status-approved';
          case 'rejected': return 'status-rejected';
          case 'not_available': return 'status-not-available';
          default: return 'status-pending';
        }
      };

      return (
        <div className="notification-card doctor-notification">
          <div className="notification-card-header">
            <span className="notification-card-icon">🩸</span>
            <span className="notification-card-title">
              Patient: {request.patientName}
            </span>
            <span className={`notification-card-bloodtype bloodtype-${request.bloodType.replace('+','plus').replace('-','minus')}`}>
              {request.bloodType}
            </span>
            <span className="notification-card-time">{formatTimeAgo(notification.createdAt)}</span>
          </div>
          <div className="notification-card-body">
            <div className={`status-message ${getStatusClass(request.status)}`}>
              {getStatusMessage(request.status)}
            </div>
          </div>
        </div>
      );
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
    switch (userRole) {
      case 'admin': return 'Blood Requests';
      case 'doctor': return 'Request Status Updates';
      default: return 'Notifications';
    }
  };

  // Show donation_reminder only for user role 'user', exclude for admin and doctor
  const getFilteredNotifications = () => {
    if (userRole === 'doctor') {
      // For doctors, only show notifications about blood request status changes (approved/rejected)
      return notifications.filter(notification => {
        return notification.type === 'blood-request' && 
               notification.relatedRequest && 
               (notification.relatedRequest.status === 'approved' || 
                notification.relatedRequest.status === 'rejected' ||
                notification.relatedRequest.status === 'not_available');
      });
    }
    
    if (userRole === 'user') {
      return notifications.filter(n => n.type === 'donation_reminder' || n.type === 'general' || n.type === 'blood-request');
    }
    
    // For admin, show all notifications
    return notifications;
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