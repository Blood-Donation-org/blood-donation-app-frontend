import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/Stock.css';

const Stock = () => {
  const navigate = useNavigate();
  const [bloodStocks, setBloodStocks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  
  // Form states for adding blood
  const [addForm, setAddForm] = useState({
    bloodType: 'A+',
    units: 1,
    donorName: '',
    donorPhone: '',
    donorAge: '',
    donationDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    notes: ''
  });

  // Form states for issuing blood
  const [issueForm, setIssueForm] = useState({
    bloodType: '',
    units: 1,
    requestId: '',
    doctorName: '',
    patientName: '',
    reason: ''
  });

  useEffect(() => {
    const fetchBloodStocks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/blood-inventory/');
        // Assuming response.data.bloodInventory is an array of inventory items
        const inventory = response.data.bloodInventory || response.data || [];
        setBloodStocks(inventory);
      } catch (err) {
        console.error('Error fetching blood inventory:', err);
        setBloodStocks([]);
      }
    };
    fetchBloodStocks();
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/stock-result/${id}`);
  };

  const handleAddBlood = () => {
    setShowAddModal(true);
  };

  const handleIssueBlood = (bloodType) => {
    setIssueForm(prev => ({ ...prev, bloodType }));
    setShowIssueModal(true);
  };

  const generateBloodPacketId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `BP${timestamp}${random}`;
  };

  const submitAddBlood = async (e) => {
    e.preventDefault();

    if (!addForm.donorName || !addForm.donorPhone || !addForm.donorAge) {
      alert('Please fill in all donor details');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/v1/blood-inventory/create', {
        bloodType: addForm.bloodType,
        units: parseInt(addForm.units),
        donerName: addForm.donorName,
        donerphone: addForm.donorPhone,
        donerAge: addForm.donorAge,
        donationDate: addForm.donationDate,
        Notes: addForm.notes
      });
      if (response.status === 201) {
        alert(`Successfully added ${addForm.units} unit(s) of ${addForm.bloodType} blood to inventory`);
        setShowAddModal(false);
        resetAddForm();
        // Optionally reload stocks from backend here
      } else {
        alert(response.data.message || 'Failed to add blood inventory');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Server error. Please try again later.');
      }
    }
  };

  const submitIssueBlood = async (e) => {
    e.preventDefault();

    if (!issueForm.requestId || !issueForm.doctorName || !issueForm.patientName) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/v1/blood-issues/issue', {
        bloodType: issueForm.bloodType,
        unitsToIssue: parseInt(issueForm.units),
        requestId: issueForm.requestId,
        doctorName: issueForm.doctorName,
        patientName: issueForm.patientName,
        reason: issueForm.reason
      });

      if (response.status === 201) {
        alert(`Successfully issued ${issueForm.units} unit(s) of ${issueForm.bloodType} blood`);
        setShowIssueModal(false);
        resetIssueForm();
        // Optionally reload stocks from backend to reflect updated units
        const updatedInventory = await axios.get('http://localhost:5000/api/v1/blood-inventory/');
        const inventory = updatedInventory.data.bloodInventory || updatedInventory.data || [];
        setBloodStocks(inventory);
      } else {
        alert(response.data.message || 'Failed to issue blood');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Server error. Please try again later.');
      }
    }
  };

  const resetAddForm = () => {
    setAddForm({
      bloodType: 'A+',
      units: 1,
      donorName: '',
      donorPhone: '',
      donorAge: '',
      donationDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      notes: ''
    });
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
            <button className="add-blood-btn" onClick={handleAddBlood}>
              + Add Blood Packet
            </button>
          </div>
          
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
                    onClick={() => handleViewDetails(stock.id)}
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
        </div>
      </div>

      {/* Add Blood Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Blood to Inventory</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            
            <form className="modal-form" onSubmit={submitAddBlood}>
              <div className="form-row">
                <div className="form-group">
                  <label>Blood Type</label>
                  <select 
                    value={addForm.bloodType}
                    onChange={(e) => setAddForm({...addForm, bloodType: e.target.value})}
                    required
                  >
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
                <div className="form-group">
                  <label>Units</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="10"
                    value={addForm.units}
                    onChange={(e) => setAddForm({...addForm, units: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Donor Name</label>
                  <input 
                    type="text" 
                    value={addForm.donorName}
                    onChange={(e) => setAddForm({...addForm, donorName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Donor Phone</label>
                  <input 
                    type="tel" 
                    value={addForm.donorPhone}
                    onChange={(e) => setAddForm({...addForm, donorPhone: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Donor Age</label>
                  <input 
                    type="number" 
                    min="18" 
                    max="65"
                    value={addForm.donorAge}
                    onChange={(e) => setAddForm({...addForm, donorAge: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Donation Date</label>
                  <input 
                    type="date" 
                    value={addForm.donationDate}
                    onChange={(e) => setAddForm({...addForm, donationDate: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Notes (Optional)</label>
                <textarea 
                  value={addForm.notes}
                  onChange={(e) => setAddForm({...addForm, notes: e.target.value})}
                  rows="3"
                ></textarea>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Issue Blood Modal */}
      {showIssueModal && (
        <div className="modal-overlay" onClick={() => setShowIssueModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Issue Blood from Inventory</h2>
              <button className="close-btn" onClick={() => setShowIssueModal(false)}>×</button>
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
                  />
                </div>
                <div className="form-group">
                  <label>Doctor Name</label>
                  <input 
                    type="text" 
                    value={issueForm.doctorName}
                    onChange={(e) => setIssueForm({...issueForm, doctorName: e.target.value})}
                    required
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
                  />
                </div>
                <div className="form-group">
                  <label>Reason/Medical Condition</label>
                  <input 
                    type="text" 
                    value={issueForm.reason}
                    onChange={(e) => setIssueForm({...issueForm, reason: e.target.value})}
                    placeholder="e.g., Surgery, Emergency"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowIssueModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Issue Blood
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