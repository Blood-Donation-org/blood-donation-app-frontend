import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/SearchResults.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/Navbar'; // Import the Navbar component

const SearchResultsPage = () => {
  const location = useLocation();
  const searchParams = location.state || {};
  
  // Sample search results data - filter based on search params
  // In a real app, you would fetch this data from an API
  const allDonors = [
    {
      id: 1,
      name: "A.D.Perera",
      gender: "Male",
      bloodGroup: "AB+",
      mobile: "0704527896",
      email: "abc@gmail.com",
      age: "30 yrs",
      address: "Colombo",
      message: "Call me if blood required"
    },
    {
      id: 2,
      name: "S.H.Amarathunga",
      gender: "Female",
      bloodGroup: "AB+",
      mobile: "0714588012",
      email: "sanduni@gmail.com",
      age: "30 yrs",
      address: "Gampaha",
      message: "Call me if blood required"
    },
    {
      id: 3,
      name: "K.D.Silva",
      gender: "Female",
      bloodGroup: "O+",
      mobile: "0772107752",
      email: "silva@gmail.com",
      age: "25 yrs",
      address: "Colombo",
      message: "Call me if blood required"
    }
  ];

  // Filter results based on search parameters
  const searchResults = allDonors.filter(donor => {
    const matchesBloodGroup = !searchParams.bloodGroup || donor.bloodGroup === searchParams.bloodGroup;
    const matchesLocation = !searchParams.location || donor.address === searchParams.location;
    return matchesBloodGroup && matchesLocation;
  });

  const handleRequest = (donorName) => {
    alert(`Request sent to ${donorName}`);
    // Add your request logic here
  };

  return (
    <div className="search-results-page">
      {/* Use the Navbar Component */}
      <Navbar />

      {/* Search Results Section */}
      <div className="search-results-section">
        <div className="search-results-container">
          <h1 className="results-title">Search Blood Donors</h1>
          
          <div className="results-grid">
            {searchResults.map((donor) => (
              <div key={donor.id} className="result-card">
                <div className="result-avatar">
                  <div className="avatar-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor"/>
                      <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="currentColor"/>
                    </svg>
                  </div>
                </div>
                
                <div className="result-info">
                  <div className="info-row">
                    <span className="info-text">Name : {donor.name}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-text">Gender : {donor.gender}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-text">Blood Group : {donor.bloodGroup}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-text">Mobile Number : {donor.mobile}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-text">E-mail : {donor.email}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-text">Age : {donor.age}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-text">Address : {donor.address}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-text">Message : {donor.message}</span>
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

export default SearchResultsPage;