import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Stock.css';
import Navbar from '../components/Navbar';

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
    loadBloodStocks();
  }, []);

  const loadBloodStocks = () => {
    const stocks = JSON.parse(localStorage.getItem('bloodStocks')) || [
      { type: 'A+', count: 100 },
      { type: 'A-', count: 90 },
      { type: 'B+', count: 120 },
      { type: 'B-', count: 80 },
      { type: 'O+', count: 110 },
      { type: 'O-', count: 75 },
      { type: 'AB+', count: 110 },
      { type: 'AB-', count: 66 }
    ];
    
    localStorage.setItem('bloodStocks', JSON.stringify(stocks));
    setBloodStocks(stocks);
  };

  const handleViewDetails = (bloodType) => {
    const encodedBloodType = encodeURIComponent(bloodType);
    navigate(`/stock-result/${encodedBloodType}`);
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

  const submitAddBlood = (e) => {
    e.preventDefault();
    
    if (!addForm.donorName || !addForm.donorPhone || !addForm.donorAge) {
      alert('Please fill in all donor details');
      return;
    }

    // Calculate expiry date (35 days from donation)
    const donationDate = new Date(addForm.donationDate);
    const expiryDate = new Date(donationDate);
    expiryDate.setDate(expiryDate.getDate() + 35);

    // Generate unique blood packet IDs
    const bloodPackets = [];
    for (let i = 0; i < parseInt(addForm.units); i++) {
      bloodPackets.push({
        id: generateBloodPacketId(),
        bloodType: addForm.bloodType,
        donorName: addForm.donorName,
        donorPhone: addForm.donorPhone,
        donorAge: addForm.donorAge,
        donationDate: addForm.donationDate,
        expiryDate: expiryDate.toISOString().split('T')[0],
        notes: addForm.notes,
        status: 'available'
      });
    }

    // Save blood packets to localStorage
    const existingPackets = JSON.parse(localStorage.getItem('bloodPackets')) || [];
    const updatedPackets = [...existingPackets, ...bloodPackets];
    localStorage.setItem('bloodPackets', JSON.stringify(updatedPackets));

    // Update blood stocks
    const updatedStocks = bloodStocks.map(stock => 
      stock.type === addForm.bloodType 
        ? { ...stock, count: stock.count + parseInt(addForm.units) }
        : stock
    );
    
    setBloodStocks(updatedStocks);
    localStorage.setItem('bloodStocks', JSON.stringify(updatedStocks));

    // Save donation record
    const donations = JSON.parse(localStorage.getItem('donations')) || [];
    const newDonation = {
      id: `DON${Date.now()}`,
      donorName: addForm.donorName,
      donorPhone: addForm.donorPhone,
      donorAge: addForm.donorAge,
      bloodType: addForm.bloodType,
      units: parseInt(addForm.units),
      donationDate: addForm.donationDate,
      expiryDate: expiryDate.toISOString().split('T')[0],
      bloodPacketIds: bloodPackets.map(p => p.id),
      notes: addForm.notes
    };
    donations.push(newDonation);
    localStorage.setItem('donations', JSON.stringify(donations));

    alert(`Successfully added ${addForm.units} unit(s) of ${addForm.bloodType} blood to inventory`);
    setShowAddModal(false);
    resetAddForm();
  };

  const submitIssueBlood = (e) => {
    e.preventDefault();
    
    if (!issueForm.requestId || !issueForm.doctorName || !issueForm.patientName) {
      alert('Please fill in all required fields');
      return;
    }

    const currentStock = bloodStocks.find(stock => stock.type === issueForm.bloodType);
    if (!currentStock || currentStock.count < parseInt(issueForm.units)) {
      alert('Insufficient blood stock available');
      return;
    }

    // Get available blood packets for this blood type
    const bloodPackets = JSON.parse(localStorage.getItem('bloodPackets')) || [];
    const availablePackets = bloodPackets
      .filter(packet => packet.bloodType === issueForm.bloodType && packet.status === 'available')
      .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate)) // Use oldest first
      .slice(0, parseInt(issueForm.units));

    if (availablePackets.length < parseInt(issueForm.units)) {
      alert('Not enough available blood packets');
      return;
    }

    // Mark packets as issued
    const updatedPackets = bloodPackets.map(packet => {
      if (availablePackets.some(ap => ap.id === packet.id)) {
        return {
          ...packet,
          status: 'issued',
          issuedDate: new Date().toISOString().split('T')[0],
          issuedTo: {
            requestId: issueForm.requestId,
            doctorName: issueForm.doctorName,
            patientName: issueForm.patientName,
            reason: issueForm.reason
          }
        };
      }
      return packet;
    });

    localStorage.setItem('bloodPackets', JSON.stringify(updatedPackets));

    // Update blood stocks
    const updatedStocks = bloodStocks.map(stock => 
      stock.type === issueForm.bloodType 
        ? { ...stock, count: stock.count - parseInt(issueForm.units) }
        : stock
    );
    
    setBloodStocks(updatedStocks);
    localStorage.setItem('bloodStocks', JSON.stringify(updatedStocks));

    // Save issuance record
    const issuances = JSON.parse(localStorage.getItem('bloodIssuances')) || [];
    const newIssuance = {
      id: `ISS${Date.now()}`,
      bloodType: issueForm.bloodType,
      units: parseInt(issueForm.units),
      requestId: issueForm.requestId,
      doctorName: issueForm.doctorName,
      patientName: issueForm.patientName,
      reason: issueForm.reason,
      issuedDate: new Date().toISOString().split('T')[0],
      bloodPacketIds: availablePackets.map(p => p.id)
    };
    issuances.push(newIssuance);
    localStorage.setItem('bloodIssuances', JSON.stringify(issuances));

    alert(`Successfully issued ${issueForm.units} unit(s) of ${issueForm.bloodType} blood`);
    setShowIssueModal(false);
    resetIssueForm();
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
              <div key={index} className={`blood-card ${getStockStatusClass(stock.count)}`}>
                <div className="blood-info">
                  <div className="blood-type">{stock.type}</div>
                  <div className="blood-count">{stock.count}</div>
                  <div className="stock-status">
                    {stock.count < 20 ? 'Low Stock' : 
                     stock.count < 50 ? 'Medium Stock' : 'In Stock'}
                  </div>
                </div>
                <div className="card-actions">
                  <button 
                    className="view-details-btn"
                    onClick={() => handleViewDetails(stock.type)}
                  >
                    View Details
                  </button>
                  <button 
                    className="issue-blood-btn"
                    onClick={() => handleIssueBlood(stock.type)}
                    disabled={stock.count === 0}
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