import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/DoctorManagement.css';

const DoctorManagement = () => {
  const [userData, setUserData] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    email: '',
    phone: '',
    hospitalAffiliation: '',
    specialization: '',
    licenseNumber: '',
    experience: '',
    dateOfBirth: '',
    address: '',
    password: '',
    bloodType: ''
  });
  const [phoneError, setPhoneError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userData'));
    if (user && user.user.role === 'admin') {
      setUserData(user);
      fetchDoctors();
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    applyFilters();
  }, [doctors, searchTerm, filterSpecialization]);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/doctor-profiles/');
      // Adjust according to backend response structure
      const doctorProfiles = response.data.doctorProfiles || response.data || [];
      setDoctors(doctorProfiles);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors([]);
    }
  };

  const applyFilters = () => {
    let filtered = [...doctors];

    // Filter by specialization
    if (filterSpecialization !== 'all') {
      filtered = filtered.filter(doctor => doctor.specialization === filterSpecialization);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(term) ||
        doctor.email.toLowerCase().includes(term) ||
        doctor.hospitalAffiliation.toLowerCase().includes(term) ||
        doctor.licenseNumber.toLowerCase().includes(term) ||
        doctor.specialization.toLowerCase().includes(term)
      );
    }

    setFilteredDoctors(filtered);
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();

    // Validation
    if (!newDoctor.name || !newDoctor.email || !newDoctor.phone || 
        !newDoctor.hospitalAffiliation || !newDoctor.specialization || 
        !newDoctor.licenseNumber || !newDoctor.password || !newDoctor.bloodType) {
      alert('Please fill in all required fields');
      return;
    }

    // Phone validation
    const phonePattern = /^0\d{9}$/;
    if (!phonePattern.test(newDoctor.phone)) {
      setPhoneError('Enter a valid Sri Lankan phone number (10 digits, starting with 0)');
      return;
    } else {
      setPhoneError('');
    }

    try {
      const response = await axios.post('http://localhost:5000/api/v1/doctor-profiles/create', {
        // User fields
        accountType: '',
        email: newDoctor.email,
        password: newDoctor.password,
        fullName: newDoctor.name,
        phoneNumber: newDoctor.phone,
        dob: newDoctor.dateOfBirth,
        bloodType: newDoctor.bloodType,
        address: newDoctor.address,
        medicalHistory: '',
        isDoner: false,
        isPatient: false,
        // Doctor profile fields
        hospitalAffiliation: newDoctor.hospitalAffiliation,
        specialization: newDoctor.specialization,
        medicalLicenseNumber: newDoctor.licenseNumber,
        yearsOfExperience: newDoctor.experience
      });

      if (response.status === 201) {
        alert('Doctor added successfully!');
        setShowAddModal(false);
        setNewDoctor({
          name: '',
          email: '',
          phone: '',
          hospitalAffiliation: '',
          specialization: '',
          licenseNumber: '',
          experience: '',
          dateOfBirth: '',
          address: '',
          password: '',
          bloodType: ''
        });
        // Reload doctors from backend
        fetchDoctors();
      } else {
        alert(response.data.message || 'Failed to add doctor');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Server error. Please try again later.');
      }
    }
  };

  // Optionally update to use backend for delete in future
  const handleDeleteDoctor = (doctorId) => {
    // Find the doctor object from doctors array
    const doctorObj = doctors.find(doc => (doc.id || doc._id) === doctorId);
    console.log('Deleting doctor object:', doctorObj);
    if (window.confirm('Are you sure you want to remove this doctor?')) {
      try {
        // Call backend API to delete doctor
        axios.delete(`http://localhost:5000/api/v1/doctor-profiles/delete/${doctorId}`)
          .then((response) => {
            alert(response.data.message || 'Doctor removed successfully!');
            fetchDoctors();
          })
          .catch((error) => {
            alert(
              error.response?.data?.message ||
              'Failed to remove doctor. Please try again.'
            );
          });
      } catch (error) {
        alert('Server error. Please try again later.');
      }
    }
  };

  const handleViewDetails = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDetailsModal(true);
  };

  const getSpecializations = () => {
    const specializations = [...new Set(doctors.map(doctor => doctor.specialization))];
    return specializations.filter(spec => spec); // Remove empty values
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="doctor-management-page">
      <Navbar />
      <div className="doctor-management-container">
        <div className="management-header">
          <div className="header-content">
            <h1>Doctor Management</h1>
            <p>Manage registered doctors in the system</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="add-doctor-btn"
          >
            + Add Doctor
          </button>
        </div>

        {/* Statistics */}
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-number">{doctors.length}</div>
            <div className="stat-label">Total Doctors</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{getSpecializations().length}</div>
            <div className="stat-label">Specializations</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{doctors.filter(d => d.status === 'active').length}</div>
            <div className="stat-label">Active Doctors</div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-row">
            <div className="filter-group">
              <label>Specialization:</label>
              <select
                value={filterSpecialization}
                onChange={(e) => setFilterSpecialization(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Specializations</option>
                {getSpecializations().map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            <div className="search-group">
              <input
                type="text"
                placeholder="Search by name, email, hospital, or license..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>

        {/* Doctors List */}
        <div className="doctors-list">
          {filteredDoctors.length === 0 ? (
            <div className="no-doctors">
              <div className="no-doctors-icon">👨‍⚕️</div>
              <h3>No doctors found</h3>
              <p>
                {doctors.length === 0 
                  ? "No doctors have been added to the system yet."
                  : "No doctors match your current filters."}
              </p>
              {doctors.length === 0 && (
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="add-first-btn"
                >
                  Add First Doctor
                </button>
              )}
            </div>
          ) : (
            <div className="doctors-grid">
              {filteredDoctors.map((doctor) => {
                // ...existing code...
                const user = doctor.userId || {};
                const docName = user.name || user.fullName || '';
                return (
                  <div key={doctor.id || doctor._id} className="doctor-card">
                    <div className="doctor-avatar">
                      {docName.charAt(0).toUpperCase()}
                    </div>
                    <div className="doctor-info">
                      <h3>{docName}</h3>
                      <p className="specialization">{doctor.specialization}</p>
                      <p className="hospital">{doctor.hospitalAffiliation}</p>
                      <div className="doctor-details">
                        <div className="detail-item">
                          <span className="label">License:</span>
                          <span className="value">{doctor.licenseNumber || doctor.medicalLicenseNumber}</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Experience:</span>
                          <span className="value">{doctor.experience || doctor.yearsOfExperience || 'N/A'} years</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Email:</span>
                          <span className="value">{user.email}</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Phone:</span>
                          <span className="value">{user.phone || user.phoneNumber}</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Blood Type:</span>
                          <span className="value">{user.bloodType}</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Date of Birth:</span>
                          <span className="value">{user.dateOfBirth || user.dob}</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Address:</span>
                          <span className="value">{user.address}</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Medical History:</span>
                          <span className="value">{user.medicalHistory}</span>
                        </div>
                      </div>
                    </div>
                    <div className="doctor-actions">
                      <button 
                        onClick={() => handleViewDetails(doctor)}
                        className="view-btn"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => handleDeleteDoctor(doctor.userId._id)}
                        className="delete-btn"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add Doctor Modal */}
        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Add New Doctor</h2>
                <button onClick={() => setShowAddModal(false)} className="close-btn">×</button>
              </div>

              <form onSubmit={handleAddDoctor} className="modal-body">
                <div className="form-section">
                  <h4>Personal Information</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        value={newDoctor.name}
                        onChange={(e) => setNewDoctor({...newDoctor, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        value={newDoctor.email}
                        onChange={(e) => setNewDoctor({...newDoctor, email: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone *</label>
                      <input
                        type="tel"
                        value={newDoctor.phone}
                        onChange={(e) => {
                          const value = e.target.value;
                          setNewDoctor({ ...newDoctor, phone: value });
                          const phonePattern = /^0\d{9}$/;
                          if (!phonePattern.test(value)) {
                            setPhoneError('Enter a valid Sri Lankan phone number (10 digits, starting with 0)');
                          } else {
                            setPhoneError('');
                          }
                        }}
                        required
                      />
                      {phoneError && (
                        <small style={{ color: 'red' }}>{phoneError}</small>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Date of Birth</label>
                      <input
                        type="date"
                        value={newDoctor.dateOfBirth}
                        onChange={(e) => setNewDoctor({...newDoctor, dateOfBirth: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Blood Type *</label>
                      <select
                        value={newDoctor.bloodType}
                        onChange={(e) => setNewDoctor({...newDoctor, bloodType: e.target.value})}
                        required
                      >
                        <option value="">Select blood type</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <textarea
                      value={newDoctor.address}
                      onChange={(e) => setNewDoctor({...newDoctor, address: e.target.value})}
                      rows="2"
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h4>Professional Information</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Hospital Affiliation *</label>
                      <input
                        type="text"
                        value={newDoctor.hospitalAffiliation}
                        onChange={(e) => setNewDoctor({...newDoctor, hospitalAffiliation: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Specialization *</label>
                      <select
                        value={newDoctor.specialization}
                        onChange={(e) => setNewDoctor({...newDoctor, specialization: e.target.value})}
                        required
                      >
                        <option value="">Select specialization</option>
                        <option value="General Medicine">General Medicine</option>
                        <option value="Emergency Medicine">Emergency Medicine</option>
                        <option value="Surgery">Surgery</option>
                        <option value="Cardiology">Cardiology</option>
                        <option value="Hematology">Hematology</option>
                        <option value="Oncology">Oncology</option>
                        <option value="Pediatrics">Pediatrics</option>
                        <option value="Gynecology">Gynecology</option>
                        <option value="Orthopedics">Orthopedics</option>
                        <option value="Neurology">Neurology</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Medical License Number *</label>
                      <input
                        type="text"
                        value={newDoctor.licenseNumber}
                        onChange={(e) => setNewDoctor({...newDoctor, licenseNumber: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Years of Experience</label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={newDoctor.experience}
                        onChange={(e) => setNewDoctor({...newDoctor, experience: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h4>Account Information</h4>
                  <div className="form-group">
                    <label>Password *</label>
                    <input
                      type="password"
                      value={newDoctor.password}
                      onChange={(e) => setNewDoctor({...newDoctor, password: e.target.value})}
                      minLength="6"
                      required
                    />
                    <small>Password must be at least 6 characters long</small>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" onClick={() => setShowAddModal(false)} className="cancel-btn">
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    Add Doctor
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Doctor Details Modal */}
        {showDetailsModal && selectedDoctor && (
          <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Doctor Details - {((selectedDoctor.userId && (selectedDoctor.userId.name || selectedDoctor.userId.fullName)) || '')}</h2>
                <button onClick={() => setShowDetailsModal(false)} className="close-btn">×</button>
              </div>

              <div className="modal-body">
                <div className="doctor-profile">
                  <div className="profile-avatar">
                    {((selectedDoctor.userId && (selectedDoctor.userId.name || selectedDoctor.userId.fullName)) || '').charAt(0).toUpperCase()}
                  </div>
                  <div className="profile-info">
                    <h3>{(selectedDoctor.userId && (selectedDoctor.userId.name || selectedDoctor.userId.fullName)) || ''}</h3>
                    <p>{selectedDoctor.specialization}</p>
                    <p>{selectedDoctor.hospitalAffiliation}</p>
                  </div>
                </div>

                <div className="details-section">
                  <h4>Contact Information</h4>
                  <div className="details-grid">
                    <div className="detail-item">
                      <label>Email:</label>
                      <span>{selectedDoctor.userId?.email}</span>
                    </div>
                    <div className="detail-item">
                      <label>Phone:</label>
                      <span>{selectedDoctor.userId?.phone || selectedDoctor.userId?.phoneNumber}</span>
                    </div>
                    <div className="detail-item">
                      <label>Blood Type:</label>
                      <span>{selectedDoctor.userId?.bloodType}</span>
                    </div>
                    <div className="detail-item">
                      <label>Date of Birth:</label>
                      <span>{formatDate(selectedDoctor.userId?.dateOfBirth || selectedDoctor.userId?.dob)}</span>
                    </div>
                    <div className="detail-item">
                      <label>Address:</label>
                      <span>{selectedDoctor.userId?.address || 'Not provided'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Medical History:</label>
                      <span>{selectedDoctor.userId?.medicalHistory}</span>
                    </div>
                  </div>
                </div>

                <div className="details-section">
                  <h4>Professional Details</h4>
                  <div className="details-grid">
                    <div className="detail-item">
                      <label>Hospital:</label>
                      <span>{selectedDoctor.hospitalAffiliation}</span>
                    </div>
                    <div className="detail-item">
                      <label>Specialization:</label>
                      <span>{selectedDoctor.specialization}</span>
                    </div>
                    <div className="detail-item">
                      <label>License Number:</label>
                      <span>{selectedDoctor.licenseNumber || selectedDoctor.medicalLicenseNumber}</span>
                    </div>
                    <div className="detail-item">
                      <label>Experience:</label>
                      <span>{selectedDoctor.experience || selectedDoctor.yearsOfExperience || 'N/A'} years</span>
                    </div>
                  </div>
                </div>

                <div className="details-section">
                  <h4>Account Information</h4>
                  <div className="details-grid">
                    <div className="detail-item">
                      <label>Account Created:</label>
                      <span>{formatDate(selectedDoctor.createdAt)}</span>
                    </div>
                    <div className="detail-item">
                      <label>Status:</label>
                      <span className="status-active">Active</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button onClick={() => setShowDetailsModal(false)} className="close-modal-btn">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorManagement;