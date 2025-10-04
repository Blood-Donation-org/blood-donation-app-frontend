import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Import the Navbar component
import '../styles/BloodCampsPage.css';

const BloodCampsPage = () => {
  const [userRole, setUserRole] = useState(null);
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage to determine role
    const storedUserData = JSON.parse(localStorage.getItem('userData'));
    if (storedUserData) {
      setUserRole(storedUserData.user.role);
    }
  }, []);

  useEffect(() => {
    const fetchCamps = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/camps');
        // Assuming response.data is an array of camps
        setCamps(response.data.camps || response.data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching camps:', err);
        setError(`Failed to fetch camps: ${err.message || err}`);
        setLoading(false);
      }
    };
    fetchCamps();
  }, []);

  const handleRegister = async (campId) => {
    // Get userId from localStorage
    const storedUserData = JSON.parse(localStorage.getItem('userData'));
    const userId = storedUserData?.user?.id;
    const camp = camps.find(c => c._id === campId || c.id === campId);
    console.log('Register button clicked');
    console.log('userId:', userId);
    console.log('campId:', campId);
    console.log('camp object:', camp);

    if (!userId || !campId) {
      alert('User or camp information missing.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/v1/camp-registrations/register', {
        userId,
        campId
      });
      console.log('Registration response:', response);
      if (response.status === 201) {
        alert('Registration successful!');
      } else {
        alert(response.data.message || 'Registration failed.');
      }
    } catch (error) {
      console.error('Registration error:', error);
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
                        >
                          Register
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