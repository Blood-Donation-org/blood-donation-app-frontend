import React, { useState } from 'react';
import '../styles/DonorListPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/Navbar';

const DonorListPage = () => {
  // Sample donor data
  const donors = [
    {
      id: 1,
      name: "A.D.Perera",
      gender: "Male",
      bloodGroup: "AB+",
      mobile: "0765527896",
      email: "abc@gmail.com",
      age: "30 yrs",
      address: "Colombo",
      message: "Call me if blood requiring"
    },
    {
      id: 2,
      name: "K.D.Silva",
      gender: "Female",
      bloodGroup: "O+",
      mobile: "0772107752",
      email: "silva@gmail.com",
      age: "25 yrs",
      address: "Kalutara",
      message: "Call me if blood requiring"
    },
    {
      id: 3,
      name: "S.H.Amarathunga",
      gender: "Female",
      bloodGroup: "AB+",
      mobile: "0714588012",
      email: "sanduni@gmail.com",
      age: "30 yrs",
      address: "Gampaha",
      message: "Call me if blood requiring"
    },
    {
      id: 4,
      name: "Kasun Wickramage",
      gender: "Male",
      bloodGroup: "B-",
      mobile: "0707520149",
      email: "kasun@gmail.com",
      age: "33 yrs",
      address: "Galle",
      message: "Call me if blood requiring"
    },
    {
      id: 5,
      name: "Hasini Liyanage",
      gender: "Female",
      bloodGroup: "AB-",
      mobile: "0714496752",
      email: "hasini@gmail.com",
      age: "27 yrs",
      address: "Kalutara",
      message: "Call me if blood requiring"
    },
    {
      id: 6,
      name: "Thisara Madhushika",
      gender: "Male",
      bloodGroup: "O-",
      mobile: "0771224152",
      email: "thisara@gmail.com",
      age: "23 yrs",
      address: "Colombo",
      message: "Call me if blood requiring"
    }
  ];

  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isBloodGroupOpen, setIsBloodGroupOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const locations = ['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo', 'Matara', 'Kalutara', 'Gampaha', 'Kurunegala', 'Anuradhapura'];

  const handleBloodGroupSelect = (bloodGroup) => {
    setSelectedBloodGroup(bloodGroup);
    setIsBloodGroupOpen(false);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
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
    (selectedBloodGroup ? donor.bloodGroup === selectedBloodGroup : true) &&
    (selectedLocation ? donor.address === selectedLocation : true)
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

            {/* <div className="search-button-container">
              <button className="search-btn" onClick={handleSearch}>
                SEARCH
              </button>
            </div> */}
          </div>
        </div>
      </div>

      {/* Donor List Section */}
      <div className="donor-list-section">
        <div className="donor-list-container">
          <div className="donors-grid">
            {filteredDonors.map((donor) => (
              <div key={donor.id} className="donor-card">
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
                    <span className="info-value">{donor.name}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">GENDER :</span>
                    <span className="info-value">{donor.gender}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">BLOOD GROUP :</span>
                    <span className="info-value">{donor.bloodGroup}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">MOBILE NUMBER :</span>
                    <span className="info-value">{donor.mobile}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">E-MAIL :</span>
                    <span className="info-value">{donor.email}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">AGE :</span>
                    <span className="info-value">{donor.age}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">ADDRESS :</span>
                    <span className="info-value">{donor.address}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">MESSAGE :</span>
                    <span className="info-value">{donor.message}</span>
                  </div>
                </div>

                <button 
                  className="request-btn"
                  onClick={() => handleRequest(donor.name)}
                >
                  Request
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorListPage;