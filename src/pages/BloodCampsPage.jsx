import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Import the Navbar component
import { API_ENDPOINTS } from '../config/api';
import '../styles/BloodCampsPage.css';

const BloodCampsPage = () => {
  const [userRole, setUserRole] = useState(null);
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registeredCamps, setRegisteredCamps] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  // Function to fetch camps
  const fetchCamps = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.CAMP.GET_ALL);
      // Assuming response.data is an array of camps
      setCamps(response.data.camps || response.data || []);
      setLoading(false);
    } catch (err) {
      setError(`Failed to fetch camps: ${err.message || err}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get user data from localStorage to determine role
    const storedUserData = JSON.parse(localStorage.getItem('userData'));
    if (storedUserData) {
      setUserRole(storedUserData.role);
    }
  }, []);

  useEffect(() => {
    fetchCamps();
  }, []);

  // Check if we should refresh based on navigation state
  useEffect(() => {
    if (location.state?.shouldRefresh) {
      fetchCamps();
      // Clear the state to prevent unnecessary refreshes
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Listen for navigation state changes to refresh camps when returning from add camp
  useEffect(() => {
    const handleFocus = () => {
      fetchCamps();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Check registration status for each camp after camps are loaded
  useEffect(() => {
    const checkRegistrations = async () => {
      const storedUserData = JSON.parse(localStorage.getItem('userData'));
      const userId = storedUserData?.id;
      if (!userId || camps.length === 0) return;
      const results = {};
      await Promise.all(
        camps.map(async (camp) => {
          const campId = camp._id || camp.id;
          try {
            const res = await axios.get(API_ENDPOINTS.CAMP_REGISTRATION.CHECK, {
              params: { userId, campId }
            });
            results[campId] = res.data.registered;
          } catch (err) {
            results[campId] = false;
          }
        })
      );
      setRegisteredCamps(results);
    };
    checkRegistrations();
  }, [camps]);

  const handleRegister = async (campId) => {
    // Get userId from localStorage
    const storedUserData = JSON.parse(localStorage.getItem('userData'));
    const userId = storedUserData?.id;

    if (!userId || !campId) {
      alert('User or camp information missing.');
      return;
    }

    try {
      const response = await axios.post(API_ENDPOINTS.CAMP_REGISTRATION.REGISTER, {
        userId,
        campId
      });
      if (response.status === 201) {
        alert('Registration successful! You will receive notifications about your next eligible donation date.');
        // Update the local state to reflect the registration immediately
        setRegisteredCamps(prev => ({
          ...prev,
          [campId]: true
        }));
        
        // Trigger immediate notification refresh
        if (globalThis.refreshNotifications) {
          globalThis.refreshNotifications();
        }
        
        // Also trigger refresh after a delay to ensure backend processing is complete
        setTimeout(() => {
          if (globalThis.refreshNotifications) {
            globalThis.refreshNotifications();
          }
        }, 2000);
      } else {
        alert(response.data.message || 'Registration failed.');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Server error. Please try again later.');
      }
    }
  };

  const handleAddCamp = () => {
    navigate('/add-camp');
  };

  const handleRefreshCamps = () => {
    setLoading(true);
    fetchCamps();
  };

  return (
    <div className="blood-donation-camps-page">
      {/* Use the Navbar Component */}
      <Navbar />

      {/* Add Camp Button - Only visible for admins */}
      {userRole === 'admin' && (
        <div className="add-camp-section">
          <button 
            className="add-camp-btn"
            onClick={handleAddCamp}
          >
            Add Camp
          </button>
          <button 
            className="refresh-btn"
            onClick={handleRefreshCamps}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      )}

      {/* Refresh button for non-admin users */}
      {userRole !== 'admin' && (
        <div className="refresh-section">
          <button 
            className="refresh-btn"
            onClick={handleRefreshCamps}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh Camps'}
          </button>
        </div>
      )}

      {/* Camps List Section */}
      <div className={`camps-list-section ${userRole === 'admin' ? 'with-add-btn' : ''}`}>
        <div className="camps-list-container">
          {(() => {
            if (loading) {
              return <div className="loading">Loading camps...</div>;
            }
            if (error) {
              return <div className="error">{error}</div>;
            }
            return (
              <div className="camps-grid">
                {camps.length === 0 ? (
                  <div className="no-camps">No camps available.</div>
                ) : (
                  camps.map((camp) => (
                    <div key={camp._id || camp.id} className="camp-card">
                      <div className="camp-avatar">
                        <div className="avatar-icon">
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor"/>
                            <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="currentColor"/>
                          </svg>
                        </div>
                      </div>
                      
                      <div className="camp-info">
                        <div className="info-row">
                          <span className="info-label">Name :</span>
                          <span className="info-value">{camp.campName || camp.name}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Location :</span>
                          <span className="info-value">{camp.place || camp.location}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Date :</span>
                          <span className="info-value">{camp.date}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Time :</span>
                          <span className="info-value">{camp.time}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Contact :</span>
                          <span className="info-value">{camp.contactNumber || camp.contact}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">E-mail :</span>
                          <span className="info-value">{camp.emailAddress || camp.email}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Organizer :</span>
                          <span className="info-value">{camp.organizer}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Message :</span>
                          <span className="info-value">{camp.message}</span>
                        </div>
                      </div>

                      {/* Register Button - Only visible for regular users */}
                      {userRole !== 'admin' && (
                        <button 
                          className="register-btn"
                          onClick={() => handleRegister(camp._id || camp.id)}
                          disabled={registeredCamps[camp._id || camp.id]}
                        >
                          {registeredCamps[camp._id || camp.id] ? 'You Are Registered' : 'Register'}
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default BloodCampsPage;