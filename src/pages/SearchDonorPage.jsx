import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SearchDonorPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/Navbar'; // Import the Navbar component
import searchImage from '../assets/search_donor/SearchDonor-2.png'; // You'll need to add this image

const SearchDonorPage = () => {
  const navigate = useNavigate();
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

  const handleSearch = () => {
    if (!selectedBloodGroup || !selectedLocation) {
      alert('Please select both blood group and location');
      return;
    }
    
    // Navigate to search results page with search parameters
    navigate('/search-results', { 
      state: { 
        bloodGroup: selectedBloodGroup, 
        location: selectedLocation 
      } 
    });
  };

  return (
    <div className="search-donor-page">
      {/* Use the Navbar Component */}
      <Navbar />

      {/* Search Section */}
      <div className="search-section">
        <div className="search-container">
          <div className="search-content">
            
            {/* Left Side - Image */}
            <div className="search-image-section">
              <div className="image-container">
                <img src={searchImage} alt="Blood donation process" className="search-img" />
              </div>
            </div>

            {/* Right Side - Search Form */}
            <div className="search-form-section">
              <div className="search-form-container">
                <h1 className="search-title">Search Donor</h1>
                <h2 className="search-subtitle">Details of Donors</h2>

                <div className="form-group">
                  <label className="form-label">Blood Group</label>
                  <div className="dropdown-container">
                    <div 
                      className={`custom-dropdown ${isBloodGroupOpen ? 'open' : ''}`}
                      onClick={() => {
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
                            onClick={() => handleBloodGroupSelect(bloodGroup)}
                          >
                            {bloodGroup}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Location</label>
                  <div className="dropdown-container">
                    <div 
                      className={`custom-dropdown ${isLocationOpen ? 'open' : ''}`}
                      onClick={() => {
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
                            onClick={() => handleLocationSelect(location)}
                          >
                            {location}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button className="search-btn" onClick={handleSearch}>
                  Search
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchDonorPage;