import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import bell from '../assets/nav_bar/bell-icon.png';
import '../styles/Navbar.css';
import '../styles/Notification.css';

const NotificationDropdown = ({ userRole }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/notifications/get-all');
        console.log('Notifications API response:', response);
        const allNotifications = response.data.notifications || [];
        setNotifications(allNotifications);
        const unread = allNotifications.filter(notif => notif.status !== 'read').length;
        setUnreadCount(unread);
      } catch (error) {
        setNotifications([]);
        setUnreadCount(0);
      }
    };
    fetchNotifications();
    // Optionally, poll for new notifications every 30s
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [userRole]);

  // Remove loadNotifications and sample notification logic

  const getAdminSampleNotifications = () => [
    {
      id: 1,
      type: 'blood_request',
      bloodType: 'O-',
      location: 'City Hospital, Colombo',
      urgency: 'urgent',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isRead: false,
      requesterName: 'Dr. Silva',
      unitsNeeded: 2,
      reason: 'Emergency surgery'
    },
    {
      id: 2,
      type: 'doctor_blood_request',
      doctorName: 'Dr. Perera',
      hospitalName: 'National Hospital, Kandy',
      patientName: 'John Doe',
      bloodType: 'A+',
      unitsRequired: 1,
      urgency: 'normal',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: false,
      requestId: 'DR-123456'
    }
  ];

  const getUserSampleNotifications = () => [
    {
      id: 1,
      type: 'donation_reminder',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      isRead: false,
      nextDonationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      message: 'You are eligible to donate blood again!'
    }
  ];

  const getDoctorSampleNotifications = () => [
    {
      id: 1,
      type: 'request_approved',
      requestId: 'DR-123456',
      patientName: 'John Doe',
      bloodType: 'B+',
      unitsApproved: 2,
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      isRead: false,
      message: 'Your blood request has been approved'
    },
    {
      id: 2,
      type: 'request_partial',
      requestId: 'DR-789012',
      patientName: 'Jane Smith',
      bloodType: 'O-',
      unitsRequested: 3,
      unitsAvailable: 1,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      isRead: true,
      message: 'Your blood request is partially available'
    }
  ];

  // Remove addNewBloodRequest, addUserNotification, addDoctorNotification

  const getDoctorStatusMessage = (status) => {
    switch (status) {
      case 'approved':
        return 'Your blood request has been approved';
      case 'partial':
        return 'Your blood request is partially available';
      case 'rejected':
        return 'Your blood request could not be fulfilled';
      default:
        return 'Blood request status updated';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getUrgencyClass = (urgency) => {
    switch (urgency) {
      case 'critical': return 'critical';
      case 'urgent': return 'urgent';
      default: return 'normal';
    }
  };

  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
    // Optionally, you can implement a PATCH to mark notifications as read in the backend here
    if (!isNotificationOpen) {
      setUnreadCount(0);
    }
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
    setIsNotificationOpen(false);
    // Optionally, you can implement a DELETE or PATCH to clear notifications in the backend here
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
    switch (userRole) {
      case 'admin': return 'Blood Requests';
      case 'doctor': return 'Request Updates';
      default: return 'Notifications';
    }
  };

  // Filter notifications for user role 'user' to only show donation_reminder type
  const getFilteredNotifications = () => {
    if (userRole === 'user') {
      return notifications.filter(n => n.type === 'donation_reminder');
    }
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