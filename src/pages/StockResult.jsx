import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/StockResult.css';
import Navbar from '../components/Navbar';

const StockResult = () => {
  const { bloodType: encodedBloodType } = useParams();
  const navigate = useNavigate();
  
  // Decode the blood type from URL
  const bloodType = encodedBloodType ? decodeURIComponent(encodedBloodType) : '';

  // Mock data for blood stock details
  const bloodStockData = {
    'A+': { count: 100, donors: 25, lastDonation: '2 hours ago', urgentRequests: 3 },
    'A-': { count: 90, donors: 18, lastDonation: '4 hours ago', urgentRequests: 5 },
    'B+': { count: 120, donors: 30, lastDonation: '1 hour ago', urgentRequests: 2 },
    'B-': { count: 80, donors: 16, lastDonation: '6 hours ago', urgentRequests: 7 },
    'O+': { count: 110, donors: 28, lastDonation: '3 hours ago', urgentRequests: 4 },
    'O-': { count: 75, donors: 15, lastDonation: '5 hours ago', urgentRequests: 8 },
    'AB+': { count: 110, donors: 22, lastDonation: '2 hours ago', urgentRequests: 1 },
    'AB-': { count: 66, donors: 12, lastDonation: '8 hours ago', urgentRequests: 6 }
  };

  const stockInfo = bloodStockData[bloodType] || { count: 0, donors: 0, lastDonation: 'N/A', urgentRequests: 0 };

  const handleGoBack = () => {
    navigate('/stocks');
  };

  // const visitSearchDonor = () => {
  //   navigate('/donor-list');
  // };

  // const visitRequestDonor = () => {
  //   navigate('/request-report');
  // };

  const getStockStatus = (count) => {
    if (count >= 100) return { status: 'Good', color: '#28a745' };
    if (count >= 70) return { status: 'Moderate', color: '#ffc107' };
    return { status: 'Low', color: '#dc3545' };
  };

  const stockStatus = getStockStatus(stockInfo.count);

  return (
    <div className="stock-result-page">
      {/* Use the Navbar Component */}
      <Navbar />
      
      <div className="stock-result-container">
        <div className="stock-result-content">
          <div className="header-section">
            <button className="back-btn" onClick={handleGoBack}>
              ‹ Back to Stock
            </button>
            <h1 className="result-title">Blood Type {bloodType} Details</h1>
          </div>

          <div className="result-grid">
            <div className="main-info-card">
              <div className="blood-type-display">
                <span className="blood-type-large">{bloodType}</span>
                <div className="stock-status" style={{ color: stockStatus.color }}>
                  {stockStatus.status} Stock
                </div>
              </div>
              <div className="count-display">
                <span className="count-number">{stockInfo.count}</span>
                <span className="count-label">Units Available</span>
              </div>
            </div>

            {/* <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon donors">👥</div>
                <div className="stat-info">
                  <span className="stat-number">{stockInfo.donors}</span>
                  <span className="stat-label">Active Donors</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon time">🕒</div>
                <div className="stat-info">
                  <span className="stat-number">{stockInfo.lastDonation}</span>
                  <span className="stat-label">Last Donation</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon urgent">🚨</div>
                <div className="stat-info">
                  <span className="stat-number">{stockInfo.urgentRequests}</span>
                  <span className="stat-label">Urgent Requests</span>
                </div>
              </div>
            </div> */}

            {/* <div className="action-cards">
              <div className="action-card request">
                <h3>Request Blood</h3>
                <p>Submit a request for {bloodType} blood units for your medical facility.</p>
                <button className="action-btn request-btn" onClick={visitRequestDonor}>Submit Request</button>
              </div>

              <div className="action-card donate">
                <h3>Find Donors</h3>
                <p>Connect with available {bloodType} donors in your area.</p>
                <button className="action-btn donor-btn" onClick={visitSearchDonor}>Find Donors</button>
              </div>
            </div> */}

            <div className="compatibility-card">
              <h3>Blood Compatibility</h3>
              <div className="compatibility-info">
                <div className="compatibility-section">
                  <h4>Can donate to:</h4>
                  <div className="blood-types">
                    {getCompatibleRecipients(bloodType).map((type, index) => (
                      <span key={index} className="blood-type-tag">{type}</span>
                    ))}
                  </div>
                </div>
                <div className="compatibility-section">
                  <h4>Can receive from:</h4>
                  <div className="blood-types">
                    {getCompatibleDonors(bloodType).map((type, index) => (
                      <span key={index} className="blood-type-tag">{type}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions for blood compatibility
const getCompatibleRecipients = (bloodType) => {
  const compatibility = {
    'A+': ['A+', 'AB+'],
    'A-': ['A+', 'A-', 'AB+', 'AB-'],
    'B+': ['B+', 'AB+'],
    'B-': ['B+', 'B-', 'AB+', 'AB-'],
    'AB+': ['AB+'],
    'AB-': ['AB+', 'AB-'],
    'O+': ['A+', 'B+', 'AB+', 'O+'],
    'O-': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  };
  return compatibility[bloodType] || [];
};

const getCompatibleDonors = (bloodType) => {
  const compatibility = {
    'A+': ['A+', 'A-', 'O+', 'O-'],
    'A-': ['A-', 'O-'],
    'B+': ['B+', 'B-', 'O+', 'O-'],
    'B-': ['B-', 'O-'],
    'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    'AB-': ['A-', 'B-', 'AB-', 'O-'],
    'O+': ['O+', 'O-'],
    'O-': ['O-']
  };
  return compatibility[bloodType] || [];
};

export default StockResult;