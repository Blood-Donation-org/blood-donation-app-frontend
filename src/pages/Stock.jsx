import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddBloodModal from '../components/AddBloodModal';
import Navbar from '../components/Navbar';
import '../styles/Stock.css';

const Stock = () => {
  const navigate = useNavigate();
  const [bloodStocks, setBloodStocks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [searchPacketId, setSearchPacketId] = useState('');

  // Form states for issuing blood
  const [issueForm, setIssueForm] = useState({
    bloodType: '',
    units: 1,
    requestId: '',
    doctorName: '',
    patientName: '',
    reason: ''
  });

  // Fetch blood stocks function
  const fetchBloodStocks = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5000/api/v1/blood-inventory/summary/stock');
      // Use stock summary for main view
      const stockSummary = response.data.stockSummary || [];
      setBloodStocks(stockSummary);
    } catch (err) {
      console.error('Error fetching blood inventory:', err);
      setBloodStocks([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBloodStocks();
  }, []);

  const handleViewDetails = (bloodType) => {
    navigate(`/blood-packets?filter=${bloodType}`);
  };

  const handleAddBlood = () => {
    setShowAddModal(true);
  };

  const handleSearchPacket = () => {
    setShowSearchModal(true);
    setSearchResult(null);
    setSearchPacketId('');
  };

  const searchBloodPacket = async (e) => {
    e.preventDefault();
    if (!searchPacketId.trim()) {
      alert('Please enter a Packet ID to search');
      return;
    }

    try {
      setIsSearching(true);
      const response = await axios.get(`http://localhost:5000/api/v1/blood-inventory/packet/${searchPacketId}`);
      
      if (response.data) {
        setSearchResult(response.data);
      } else {
        setSearchResult(null);
        alert('No blood packet found with this ID');
      }
    } catch (error) {
      console.error('Error searching blood packet:', error);
      setSearchResult(null);
      if (error.response?.status === 404) {
        alert('Blood packet not found with ID: ' + searchPacketId);
      } else {
        alert('Error searching for blood packet. Please try again.');
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddBloodSuccess = async () => {
    // Refresh the blood stocks after successful addition
    await fetchBloodStocks();
  };

  const handleIssueBlood = (bloodType) => {
    setIssueForm(prev => ({ ...prev, bloodType }));
    setShowIssueModal(true);
  };

  const handleSearchBlood = () => {
    setShowSearchModal(true);
  };

  const submitIssueBlood = async (e) => {
    e.preventDefault();

    if (!issueForm.requestId || !issueForm.doctorName || !issueForm.patientName) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:5000/api/v1/blood-issues/issue', {
        bloodType: issueForm.bloodType,
        unitsToIssue: parseInt(issueForm.units),
        requestId: issueForm.requestId,
        doctorName: issueForm.doctorName,
        patientName: issueForm.patientName,
        reason: issueForm.reason
      });

      if (response.status === 201) {
        const issuedUnits = issueForm.units;
        const issuedBloodType = issueForm.bloodType;
        
        // Reset form
        resetIssueForm();
        
        // Close modal
        setShowIssueModal(false);
        
        // Reload inventory
        await fetchBloodStocks();
        
        // Show success message
        alert(`Successfully issued ${issuedUnits} unit(s) of ${issuedBloodType} blood`);
      } else {
        alert(response.data.message || 'Failed to issue blood');
      }
    } catch (error) {
      console.error('Error issuing blood:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Server error. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetIssueForm = () => {
    setIssueForm({
      bloodType: '',
      units: 1,
      requestId: '',
      doctorName: '',
      patientName: '',
      reason: ''
    });
  };

  const getStockStatusClass = (count) => {
    if (count < 20) return 'low-stock';
    if (count < 50) return 'medium-stock';
    return 'normal-stock';
  };

  return (
    <div className="stock-page">
      <Navbar />
      
      <div className="stock-container">
        <div className="stock-content">
          <div className="stock-header">
            <div>
              <h1 className="stock-title">Blood Inventory</h1>
              <p className="stock-subtitle">Available blood stocks</p>
            </div>
            <div className="header-actions">
              <button 
                className="add-blood-btn" 
                onClick={handleAddBlood}
                disabled={isLoading}
              >
                + Add Blood Packet
              </button>
              {/* <button 
                className="search-packet-btn" 
                onClick={handleSearchPacket}
                disabled={isLoading}
              >
                🔍 Search Packet
              </button> */}
              
            </div>
          </div>
          
          {isLoading ? (
            <div className="loading-message">Loading blood inventory...</div>
          ) : (
            <div className="blood-grid">
              {bloodStocks.map((stock, index) => (
                <div key={stock.bloodType || index} className={`blood-card ${getStockStatusClass(parseInt(stock.totalUnits))}`}>
                  <div className="blood-info">
                    <div className="blood-type">{stock.bloodType}</div>
                    <div className="blood-count">{stock.totalUnits}</div>
                    <div className="packet-count">{stock.totalPackets} packets</div>
                    <div className="stock-status">
                      {parseInt(stock.totalUnits) < 20 ? 'Low Stock' : 
                       parseInt(stock.totalUnits) < 50 ? 'Medium Stock' : 'In Stock'}
                    </div>
                  </div>
                  <div className="card-actions">
                    <button 
                      className="view-details-btn"
                      onClick={() => handleViewDetails(stock.bloodType)}
                    >
                      View Details
                    </button>
                    <button 
                      className="issue-blood-btn"
                      onClick={() => handleIssueBlood(stock.bloodType)}
                      disabled={parseInt(stock.totalUnits) === 0}
                    >
                      Issue Blood
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Blood Modal */}
      <AddBloodModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddBloodSuccess}
      />

      {/* Issue Blood Modal */}
      {showIssueModal && (
        <div className="modal-overlay" onClick={() => !isLoading && setShowIssueModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Issue Blood from Inventory</h2>
              <button 
                className="close-btn" 
                onClick={() => setShowIssueModal(false)}
                disabled={isLoading}
              >
                ×
              </button>
            </div>
            
            <form className="modal-form" onSubmit={submitIssueBlood}>
              <div className="form-row">
                <div className="form-group">
                  <label>Blood Type</label>
                  <input 
                    type="text" 
                    value={issueForm.bloodType}
                    readOnly
                    className="readonly-input"
                  />
                </div>
                <div className="form-group">
                  <label>Units to Issue</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="10"
                    value={issueForm.units}
                    onChange={(e) => setIssueForm({...issueForm, units: e.target.value})}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Request ID</label>
                  <input 
                    type="text" 
                    value={issueForm.requestId}
                    onChange={(e) => setIssueForm({...issueForm, requestId: e.target.value})}
                    placeholder="e.g., REQ001"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="form-group">
                  <label>Doctor Name</label>
                  <input 
                    type="text" 
                    value={issueForm.doctorName}
                    onChange={(e) => setIssueForm({...issueForm, doctorName: e.target.value})}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Patient Name</label>
                  <input 
                    type="text" 
                    value={issueForm.patientName}
                    onChange={(e) => setIssueForm({...issueForm, patientName: e.target.value})}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="form-group">
                  <label>Reason/Medical Condition</label>
                  <input 
                    type="text" 
                    value={issueForm.reason}
                    onChange={(e) => setIssueForm({...issueForm, reason: e.target.value})}
                    placeholder="e.g., Surgery, Emergency"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={() => setShowIssueModal(false)} 
                  className="cancel-btn"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? 'Issuing...' : 'Issue Blood'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search Blood Packet Modal */}
      {showSearchModal && (
        <div className="modal-overlay" onClick={() => !isSearching && setShowSearchModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Search Blood Packet</h2>
              <button 
                className="close-btn" 
                onClick={() => setShowSearchModal(false)}
                disabled={isSearching}
              >
                ×
              </button>
            </div>
            
            <form className="modal-form" onSubmit={searchBloodPacket}>
              <div className="form-group">
                <label htmlFor="searchPacketId">Enter Blood Packet ID</label>
                <input 
                  id="searchPacketId"
                  type="text" 
                  value={searchPacketId}
                  onChange={(e) => setSearchPacketId(e.target.value)}
                  placeholder="e.g., BP001, PKT123"
                  required
                  disabled={isSearching}
                  style={{
                    padding: '12px',
                    fontSize: '16px',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    marginBottom: '20px'
                  }}
                />
              </div>

              {searchResult && (
                <div className="search-result" style={{
                  background: '#f8f9fa',
                  border: '2px solid #28a745',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '20px'
                }}>
                  <h3 style={{ margin: '0 0 15px 0', color: '#28a745' }}>
                    📦 Packet Found: {searchResult.packetId}
                  </h3>
                  <div className="result-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '15px'
                  }}>
                    <div><strong>Blood Type:</strong> {searchResult.bloodType}</div>
                    <div><strong>Units:</strong> {searchResult.units}</div>
                    <div><strong>Donor Name:</strong> {searchResult.donerName}</div>
                    <div><strong>Donor Phone:</strong> {searchResult.donerphone}</div>
                    <div><strong>Donor Age:</strong> {searchResult.donerAge}</div>
                    <div><strong>Donation Date:</strong> {new Date(searchResult.donationDate).toLocaleDateString()}</div>
                  </div>
                  {searchResult.Notes && (
                    <div style={{ marginTop: '15px' }}>
                      <strong>Notes:</strong> {searchResult.Notes}
                    </div>
                  )}
                </div>
              )}

              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={() => setShowSearchModal(false)} 
                  className="cancel-btn"
                  disabled={isSearching}
                >
                  Close
                </button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSearching}
                >
                  {isSearching ? 'Searching...' : '🔍 Search'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stock;