import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem('userData'));
  if (!storedUserData?.user) {
      navigate('/signin');
      return;
    }
    setUserData(storedUserData.user);
    setFormData(storedUserData.user);
  }, [navigate]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const userId = userData.id || userData._id;
      const response = await axios.put(
        `http://localhost:5000/api/v1/users/update/${userId}`,
        formData
      );
  if (response.data?.user) {
        setUserData(response.data.user);
        setFormData(response.data.user);
        localStorage.setItem('userData', JSON.stringify({ user: response.data.user }));
        setIsEditing(false);
        // Optionally, update context if needed
      }
    } catch (error) {
      console.error('Update failed:', error);
      // Optionally, show error to user
    }
  };

  const handleCancel = () => {
    setFormData(userData);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <div className="profile-content">
          <div className="profile-header">
            <div className="profile-avatar">
              <div className="avatar-circle">
                {userData.fullName ? userData.fullName.charAt(0) : '?'}
              </div>
            </div>
            <div className="profile-info">
              <h1 className="profile-name">{userData.fullName}</h1>
              <p className="profile-role">{userData.role === 'admin' ? 'System Administrator' : 'Blood Donor'}</p>
              <span className={`role-badge ${userData.role ? userData.role.toLowerCase() : 'unknown'}`}>{userData.role || 'Unknown'}</span>
            </div>
            <div className="profile-actions">
              {!isEditing ? (
                <button className="edit-btn" onClick={handleEdit}>Edit Profile</button>
              ) : (
                <>
                  <button className="save-btn" onClick={handleSave}>Save Changes</button>
                  <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                </>
              )}
            </div>
          </div>

          <div className="profile-sections">
            {/* Basic Information Section */}
            <div className="profile-section">
              <h2 className="section-title">Basic Information</h2>
              <div className="info-grid">
                <div className="info-item">
                  <label className="info-label" htmlFor="profile-name">Full Name</label>
                  {isEditing ? (
                    <input
                      id="profile-name"
                      type="text"
                      name="fullName"
                      value={formData.fullName || ''}
                      onChange={handleChange}
                      className="info-input"
                    />
                  ) : (
                    <span className="info-value">{userData.fullName}</span>
                  )}
                </div>

                <div className="info-item">
                  <label className="info-label" htmlFor="profile-email">Email Address</label>
                  {isEditing ? (
                    <input
                      id="profile-email"
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                      className="info-input"
                    />
                  ) : (
                    <span className="info-value">{userData.email}</span>
                  )}
                </div>

                <div className="info-item">
                  <label className="info-label" htmlFor="profile-phone">Phone Number</label>
                  {isEditing ? (
                    <input
                      id="profile-phone"
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber || ''}
                      onChange={handleChange}
                      className="info-input"
                    />
                  ) : (
                    <span className="info-value">{userData.phoneNumber}</span>
                  )}
                </div>

                <div className="info-item">
                  <label className="info-label" htmlFor="profile-dob">Date of Birth</label>
                  {isEditing ? (
                    <input
                      id="profile-dob"
                      type="date"
                      name="dob"
                      value={formData.dob || ''}
                      onChange={handleChange}
                      className="info-input"
                    />
                  ) : (
                    <span className="info-value">{userData.dob ? new Date(userData.dob).toLocaleDateString() : ''}</span>
                  )}
                </div>

                <div className="info-item full-width">
                  <label className="info-label" htmlFor="profile-address">Address</label>
                  {isEditing ? (
                    <textarea
                      id="profile-address"
                      name="address"
                      value={formData.address || ''}
                      onChange={handleChange}
                      className="info-textarea"
                      rows="2"
                    />
                  ) : (
                    <span className="info-value">{userData.address}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Medical Information Section - Only for regular users */}
            {userData.role !== 'admin' && (
              <div className="profile-section">
                <h2 className="section-title">Medical Information</h2>
                <div className="info-grid">
                  <div className="info-item">
                    <label className="info-label" htmlFor="profile-bloodType">Blood Type</label>
                    {isEditing ? (
                      <select
                        id="profile-bloodType"
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={handleChange}
                        className="info-select"
                      >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    ) : (
                      <span className="info-value blood-type">{userData.bloodType}</span>
                    )}
                  </div>

                  <div className="info-item">
                    <label className="info-label" htmlFor="profile-lastDonation">Last Donation</label>
                    <span className="info-value">{userData.lastDonation}</span>
                  </div>

                  <div className="info-item">
                    <label className="info-label" htmlFor="profile-donationCount">Total Donations</label>
                    <span className="info-value">{userData.donationCount}</span>
                  </div>

                  <div className="info-item full-width">
                    <label className="info-label" htmlFor="profile-medicalHistory">Medical History</label>
                    {isEditing ? (
                      <textarea
                        id="profile-medicalHistory"
                        name="medicalHistory"
                        value={formData.medicalHistory}
                        onChange={handleChange}
                        className="info-textarea"
                        rows="3"
                      />
                    ) : (
                      <span className="info-value">{userData.medicalHistory}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Admin Dashboard Section - Only for admins */}
            {userData.role === 'admin' && (
              <div className="profile-section">
                <h2 className="section-title">Admin Dashboard</h2>
                <div className="admin-stats">
                  <div className="stat-card">
                    <div className="stat-number">1,245</div>
                    <div className="stat-label">Total Donors</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">456</div>
                    <div className="stat-label">Active Campaigns</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">789</div>
                    <div className="stat-label">Blood Units</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">23</div>
                    <div className="stat-label">Urgent Requests</div>
                  </div>
                </div>
              </div>
            )}

            {/* Account Settings Section */}
            {/* <div className="profile-section">
              <h2 className="section-title">Account Settings</h2>
              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Email Notifications</h3>
                    <p>Receive notifications about donation opportunities and updates</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h3>SMS Notifications</h3>
                    <p>Get text messages for urgent blood requests</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Privacy Settings</h3>
                    <p>Control who can see your donor information</p>
                  </div>
                  <select className="setting-select">
                    <option value="public">Public</option>
                    <option value="donors">Donors Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;