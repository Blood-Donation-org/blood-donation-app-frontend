import React, { useState, useEffect } from 'react';
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
    password: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userData'));
    if (user && user.role === 'admin') {
      setUserData(user);
      loadDoctors();
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    applyFilters();
  }, [doctors, searchTerm, filterSpecialization]);

  const loadDoctors = () => {
    // Load doctors from localStorage (in a real app, this would be from backend)
    const allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
    const doctorUsers = allUsers.filter(user => user.role === 'doctor');
    setDoctors(doctorUsers);
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

  const handleAddDoctor = (e) => {
    e.preventDefault();

    // Validation
    if (!newDoctor.name || !newDoctor.email || !newDoctor.phone || 
        !newDoctor.hospitalAffiliation || !newDoctor.specialization || 
        !newDoctor.licenseNumber || !newDoctor.password) {
      alert('Please fill in all required fields');
      return;
    }

    // Check if email already exists
    const allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
    if (allUsers.some(user => user.email === newDoctor.email)) {
      alert('A user with this email already exists');
      return;
    }

    // Create doctor object
    const doctorToAdd = {
      ...newDoctor,
      id: Date.now(),
      role: 'doctor',
      createdAt: new Date().toISOString(),
      createdBy: userData.id,
      status: 'active'
    };

    // Add to all users
    allUsers.push(doctorToAdd);
    localStorage.setItem('allUsers', JSON.stringify(allUsers));

    // Update local state
    setDoctors([...doctors, doctorToAdd]);

    // Reset form and close modal
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
      password: ''
    });
    setShowAddModal(false);
    alert('Doctor added successfully!');
  };

  const handleDeleteDoctor = (doctorId) => {
    if (window.confirm('Are you sure you want to remove this doctor?')) {
      // Remove from allUsers
      const allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
      const updatedUsers = allUsers.filter(user => user.id !== doctorId);
      localStorage.setItem('allUsers', JSON.stringify(updatedUsers));

      // Update local state
      setDoctors(doctors.filter(doctor => doctor.id !== doctorId));
      alert('Doctor removed successfully!');
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
              {filteredDoctors.map((doctor) => (
                <div key={doctor.id} className="doctor-card">
                  <div className="doctor-avatar">
                    {doctor.name.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="doctor-info">
                    <h3>{doctor.name}</h3>
                    <p className="specialization">{doctor.specialization}</p>
                    <p className="hospital">{doctor.hospitalAffiliation}</p>
                    
                    <div className="doctor-details">
                      <div className="detail-item">
                        <span className="label">License:</span>
                        <span className="value">{doctor.licenseNumber}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Experience:</span>
                        <span className="value">{doctor.experience || 'N/A'} years</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Email:</span>
                        <span className="value">{doctor.email}</span>
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
                      onClick={() => handleDeleteDoctor(doctor.id)}
                      className="delete-btn"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
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
                        onChange={(e) => setNewDoctor({...newDoctor, phone: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Date of Birth</label>
                      <input
                        type="date"
                        value={newDoctor.dateOfBirth}
                        onChange={(e) => setNewDoctor({...newDoctor, dateOfBirth: e.target.value})}
                      />
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
                <h2>Doctor Details - {selectedDoctor.name}</h2>
                <button onClick={() => setShowDetailsModal(false)} className="close-btn">×</button>
              </div>

              <div className="modal-body">
                <div className="doctor-profile">
                  <div className="profile-avatar">
                    {selectedDoctor.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="profile-info">
                    <h3>{selectedDoctor.name}</h3>
                    <p>{selectedDoctor.specialization}</p>
                    <p>{selectedDoctor.hospitalAffiliation}</p>
                  </div>
                </div>

                <div className="details-section">
                  <h4>Contact Information</h4>
                  <div className="details-grid">
                    <div className="detail-item">
                      <label>Email:</label>
                      <span>{selectedDoctor.email}</span>
                    </div>
                    <div className="detail-item">
                      <label>Phone:</label>
                      <span>{selectedDoctor.phone}</span>
                    </div>
                    <div className="detail-item">
                      <label>Date of Birth:</label>
                      <span>{formatDate(selectedDoctor.dateOfBirth)}</span>
                    </div>
                    <div className="detail-item">
                      <label>Address:</label>
                      <span>{selectedDoctor.address || 'Not provided'}</span>
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
                      <span>{selectedDoctor.licenseNumber}</span>
                    </div>
                    <div className="detail-item">
                      <label>Experience:</label>
                      <span>{selectedDoctor.experience || 'N/A'} years</span>
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