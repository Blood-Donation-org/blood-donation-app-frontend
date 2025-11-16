import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/DonorListPage.css';

const DonorListPage = () => {
  // Donor data from backend
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonors = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:5000/api/v1/users/role/user');
        // Adjust according to backend response structure
        const donorList = response.data.users || response.data || [];
        setDonors(donorList);
      } catch (err) {
        console.error('Error fetching donors:', err);
        setError('Failed to fetch donors');
        setDonors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDonors();
  }, []);

  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isBloodGroupOpen, setIsBloodGroupOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const locations = ['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo', 'Matara', 'Kalutara', 'Gampaha', 'Kurunegala', 'Anuradhapura','horana'];

  const handleBloodGroupSelect = (bloodGroup) => {
    setSelectedBloodGroup(bloodGroup);
    setIsBloodGroupOpen(false);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setIsLocationOpen(false);
  };

  const handleClearFilters = () => {
    setSelectedBloodGroup('');
    setSelectedLocation('');
    setIsBloodGroupOpen(false);
    setIsLocationOpen(false);
  };

  // const handleSearch = () => {
  //   if (!selectedBloodGroup || !selectedLocation) {
  //     alert('Please select both blood group and location');
  //     return;
  //   }
  // };

  const handleRequest = (donorName) => {
    alert(`Request sent to ${donorName}`);
  };

  // Filter donors based on search criteria
  const filteredDonors = donors.filter(donor => 
    (selectedBloodGroup ? donor.bloodType === selectedBloodGroup : true) &&
    (selectedLocation ? donor.address && donor.address.toLowerCase().includes(selectedLocation.toLowerCase()) : true)
  );

  // Close dropdowns when clicking outside
  const handleOutsideClick = (e) => {
    if (!e.target.closest('.dropdown-container')) {
      setIsBloodGroupOpen(false);
      setIsLocationOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <div className="donor-list-page">
      {/* Navigation Bar */}
      <Navbar />

      {/* Horizontal Search Section */}
      <div className="search-sectionn">
        <div className="search-container">
          <div className="search-form-horizontal">
            <div className="form-group-horizontal">
              {/* <label className="form-label">Blood Group</label> */}
              <div className="dropdown-container">
                <div 
                  className={`custom-dropdown ${isBloodGroupOpen ? 'open' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsBloodGroupOpen(!isBloodGroupOpen);
                    setIsLocationOpen(false);
                  }}
                >
                  <span className="dropdown-selected">
                    {selectedBloodGroup || 'Blood Group'}
                  </span>
                  <span className="dropdown-arrow">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
                {isBloodGroupOpen && (
                  <div className="dropdown-options">
                    {bloodGroups.map((bloodGroup) => (
                      <div
                        key={bloodGroup}
                        className="dropdown-option"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBloodGroupSelect(bloodGroup);
                        }}
                      >
                        {bloodGroup}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="form-group-horizontal">
              {/* <label className="form-label">Location</label> */}
              <div className="dropdown-container">
                <div 
                  className={`custom-dropdown ${isLocationOpen ? 'open' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLocationOpen(!isLocationOpen);
                    setIsBloodGroupOpen(false);
                  }}
                >
                  <span className="dropdown-selected">
                    {selectedLocation || 'Location'}
                  </span>
                  <span className="dropdown-arrow">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
                {isLocationOpen && (
                  <div className="dropdown-options">
                    {locations.map((location) => (
                      <div
                        key={location}
                        className="dropdown-option"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLocationSelect(location);
                        }}
                      >
                        {location}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="search-button-container">
              <button className="clear-btn" onClick={handleClearFilters}>
                CLEAR FILTERS
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Donor List Section */}
      <div className="donor-list-section">
        <div className="donor-list-container">
          {loading ? (
            <div className="donors-grid"><h3>Loading donors...</h3></div>
          ) : error ? (
            <div className="donors-grid"><h3>{error}</h3></div>
          ) : (
            <div className="donors-grid">
              {filteredDonors.length === 0 ? (
                <div className="donors-grid"><h4>No donors found.</h4></div>
              ) : (
                filteredDonors.map((donor) => (
                  <div key={donor._id || donor.id} className="donor-card">
                    <div className="donor-avatar">
                      <div className="avatar-icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor"/>
                          <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="currentColor"/>
                        </svg>
                      </div>
                    </div>

                    <div className="donor-info">
                      <div className="info-row">
                        <span className="info-label">NAME :</span>
                        <span className="info-value">{donor.fullName}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">EMAIL :</span>
                        <span className="info-value">{donor.email}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">PHONE :</span>
                        <span className="info-value">
                          {/^(0\d{9})$/.test(donor.phoneNumber) ? donor.phoneNumber : 'Please enter a valid contact number'}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">BLOOD TYPE :</span>
                        <span className="info-value">{donor.bloodType}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">DATE OF BIRTH :</span>
                        <span className="info-value">{donor.dob}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">ADDRESS :</span>
                        <span className="info-value">{donor.address}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">MEDICAL HISTORY :</span>
                        <span className="info-value">{donor.medicalHistory || '-'}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">DONOR :</span>
                        <span className="info-value">{donor.isDoner ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">PATIENT :</span>
                        <span className="info-value">{donor.isPatient ? 'Yes' : 'No'}</span>
                      </div>
                    </div>

                    <button 
                      className="request-btn"
                      onClick={() => handleRequest(donor.name)}
                    >
                      Request
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonorListPage;