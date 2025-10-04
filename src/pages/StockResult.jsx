
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/StockResult.css';

const StockResult = () => {
  // Get inventoryId from route params (should be _id)
  const { id: inventoryId } = useParams();
  const navigate = useNavigate();

  const [stockInfo, setStockInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/blood-inventory/${inventoryId}`);
        // Try both .bloodInventory and direct .data
        const item = response.data.bloodInventory || response.data;
        setStockInfo(item);
      } catch (err) {
        setError('Could not fetch blood inventory details.');
        setStockInfo(null);
      } finally {
        setLoading(false);
      }
    };
    if (inventoryId) fetchStockDetails();
  }, [inventoryId]);

  const handleGoBack = () => {
    navigate('/stocks');
  };

  const getStockStatus = (units) => {
    if (units >= 100) return { status: 'Good', color: '#28a745' };
    if (units >= 70) return { status: 'Moderate', color: '#ffc107' };
    return { status: 'Low', color: '#dc3545' };
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

  if (loading) {
    return (
      <div className="stock-result-page">
        <Navbar />
        <div className="stock-result-container">
          <div className="stock-result-content">
            <h2>Loading...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error || !stockInfo) {
    return (
      <div className="stock-result-page">
        <Navbar />
        <div className="stock-result-container">
          <div className="stock-result-content">
            <h2>{error || 'No data found.'}</h2>
            <button className="back-btn" onClick={handleGoBack}>‹ Back to Stock</button>
          </div>
        </div>
      </div>
    );
  }

  const stockStatus = getStockStatus(parseInt(stockInfo.units));

  return (
    <div className="stock-result-page">
      <Navbar />
      <div className="stock-result-container">
        <div className="stock-result-content">
          <div className="header-section">
            <button className="back-btn" onClick={handleGoBack}>
              ‹ Back to Stock
            </button>
            <h1 className="result-title">Blood Type {stockInfo.bloodType} Details</h1>
          </div>

          <div className="result-grid">
            <div className="main-info-card">
              <div className="blood-type-display">
                <span className="blood-type-large">{stockInfo.bloodType}</span>
                <div className="stock-status" style={{ color: stockStatus.color }}>
                  {stockStatus.status} Stock
                </div>
              </div>
              <div className="count-display">
                <span className="count-number">{stockInfo.units}</span>
                <span className="count-label">Units Available</span>
              </div>
              <div className="donor-details">
                <div><strong>Donor Name:</strong> {stockInfo.donerName}</div>
                <div><strong>Donor Phone:</strong> {stockInfo.donerphone}</div>
                <div><strong>Donor Age:</strong> {stockInfo.donerAge}</div>
                <div><strong>Donation Date:</strong> {stockInfo.donationDate}</div>
                <div><strong>Notes:</strong> {stockInfo.Notes}</div>
              </div>
            </div>

            <div className="compatibility-card">
              <h3>Blood Compatibility</h3>
              <div className="compatibility-info">
                <div className="compatibility-section">
                  <h4>Can donate to:</h4>
                  <div className="blood-types">
                    {getCompatibleRecipients(stockInfo.bloodType).map(type => (
                      <span key={type} className="blood-type-tag">{type}</span>
                    ))}
                  </div>
                </div>
                <div className="compatibility-section">
                  <h4>Can receive from:</h4>
                  <div className="blood-types">
                    {getCompatibleDonors(stockInfo.bloodType).map(type => (
                      <span key={type} className="blood-type-tag">{type}</span>
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

export default StockResult;