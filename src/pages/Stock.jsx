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
  const [isLoading, setIsLoading] = useState(false);

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
      const response = await axios.get('http://localhost:5000/api/v1/blood-inventory/');
      // Assuming response.data.bloodInventory is an array of inventory items
      const inventory = response.data.bloodInventory || response.data || [];
      setBloodStocks(inventory);
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

  const handleViewDetails = (id) => {
    navigate(`/stock-result/${id}`);
  };

  const handleAddBlood = () => {
    setShowAddModal(true);
  };

  const handleAddBloodSuccess = async () => {
    // Refresh the blood stocks after successful addition
    await fetchBloodStocks();
  };

  const handleIssueBlood = (bloodType) => {
    setIssueForm(prev => ({ ...prev, bloodType }));
    setShowIssueModal(true);
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
            <button 
              className="add-blood-btn" 
              onClick={handleAddBlood}
              disabled={isLoading}
            >
              + Add Blood Packet
            </button>
          </div>
          
          {isLoading ? (
            <div className="loading-message">Loading blood inventory...</div>
          ) : (
            <div className="blood-grid">
              {bloodStocks.map((stock, index) => (
                <div key={stock._id || index} className={`blood-card ${getStockStatusClass(parseInt(stock.units))}`}>
                  <div className="blood-info">
                    <div className="blood-type">{stock.bloodType}</div>
                    <div className="blood-count">{stock.units}</div>
                    <div className="stock-status">
                      {parseInt(stock.units) < 20 ? 'Low Stock' : 
                       parseInt(stock.units) < 50 ? 'Medium Stock' : 'In Stock'}
                    </div>
                  </div>
                  <div className="card-actions">
                    <button 
                      className="view-details-btn"
                      onClick={() => handleViewDetails(stock._id || stock.id)}
                    >
                      View Details
                    </button>
                    <button 
                      className="issue-blood-btn"
                      onClick={() => handleIssueBlood(stock.bloodType)}
                      disabled={parseInt(stock.units) === 0}
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
    </div>
  );
};

export default Stock;