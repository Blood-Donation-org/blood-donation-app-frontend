import axios from 'axios';
import { useState } from 'react';
import '../styles/AddBloodModal.css';

const AddBloodModal = ({ isOpen, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [formData, setFormData] = useState({
    bloodPacketId: '',
    bloodType: 'A+',
    units: 1,
    donorName: '',
    donorPhone: '',
    donorAge: '',
    donationDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const validateSriLankanPhone = (phone) => {
    // Remove any spaces or dashes
    const cleanPhone = phone.replace(/[\s-]/g, '');
    
    // Sri Lankan phone numbers: 10 digits starting with 0
    const sriLankanPhoneRegex = /^0\d{9}$/;
    
    return sriLankanPhoneRegex.test(cleanPhone);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'donorPhone') {
      // Clear phone error when user starts typing
      if (phoneError) setPhoneError('');
      
      // Validate phone number
      if (value && !validateSriLankanPhone(value)) {
        setPhoneError('Phone number must be 10 digits starting with 0 (e.g., 0771234567)');
      } else {
        setPhoneError('');
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
       bloodPacketId: '',
      bloodType: 'A+',
      units: 1,
      donorName: '',
      donorPhone: '',
      donorAge: '',
      donationDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setPhoneError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.bloodPacketId || !formData.donorName || !formData.donorPhone || !formData.donorAge) {
      alert('Please fill in all required fields including Packet ID');
      return;
    }

    if (!validateSriLankanPhone(formData.donorPhone)) {
      alert('Please enter a valid Sri Lankan phone number (10 digits starting with 0)');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:5000/api/v1/blood-inventory/create', {
        bloodPacketId: formData.bloodPacketId,
        bloodType: formData.bloodType,
        units: parseInt(formData.units),
        donerName: formData.donorName,
        donerphone: formData.donorPhone,
        donerAge: formData.donorAge,
        donationDate: formData.donationDate,
        Notes: formData.notes
      });
      
      if (response.status === 201) {
        const submittedUnits = formData.units;
        const submittedBloodType = formData.bloodType;
        const bloodPacketId = response.data.bloodInventory?.bloodPacketId;
        
        // Reset form immediately after successful response
        resetForm();
        
        // Show success message
        alert(`Successfully added ${submittedUnits} unit(s) of ${submittedBloodType} blood to inventory`);
        
        // Close modal
        onClose();
        
        // Notify parent to refresh data after modal is closed with the added data
        if (onSuccess) {
          onSuccess({
            bloodPacketId: formData.bloodPacketId,
            bloodType: submittedBloodType,
            units: submittedUnits,
            donerName: formData.donorName,
            donerphone: formData.donorPhone,
            donerAge: formData.donorAge,
            donationDate: formData.donationDate,
            Notes: formData.notes
          });
        }
      } else {
        alert(response.data.message || 'Failed to add blood inventory');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Server error. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Blood to Inventory</h2>
          <button 
            className="close-btn" 
            onClick={handleClose}
            disabled={isLoading}
          >
            ×
          </button>
        </div>
        
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="bloodPacketId">Blood Packet ID</label>
              <input 
                id="bloodPacketId"
                name="bloodPacketId"
                type="text" 
                value={formData.bloodPacketId}
                onChange={handleChange}
                placeholder="e.g., BP001, PKT123"
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="bloodType">Blood Type</label>
              <select 
                id="bloodType"
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
                required
                disabled={isLoading}
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
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="units">Units</label>
              <input 
                id="units"
                name="units"
                type="number" 
                min="1" 
                max="10"
                value={formData.units}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="donorName">Donor Name</label>
              <input 
                id="donorName"
                name="donorName"
                type="text" 
                value={formData.donorName}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="donorPhone">Donor Phone</label>
              <input 
                id="donorPhone"
                name="donorPhone"
                type="tel" 
                value={formData.donorPhone}
                onChange={handleChange}
                placeholder="0771234567"
                pattern="0\d{9}"
                maxLength="10"
                required
                disabled={isLoading}
                style={{
                  borderColor: phoneError ? '#ff4444' : '',
                  backgroundColor: phoneError ? '#fff5f5' : ''
                }}
              />
              {phoneError && (
                <span style={{ 
                  color: '#ff4444', 
                  fontSize: '12px', 
                  marginTop: '4px',
                  display: 'block'
                }}>
                  {phoneError}
                </span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="donorAge">Donor Age</label>
              <input 
                id="donorAge"
                name="donorAge"
                type="number" 
                min="18" 
                max="65"
                value={formData.donorAge}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="donationDate">Donation Date</label>
              <input 
                id="donationDate"
                name="donationDate"
                type="date" 
                value={formData.donationDate}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              {/* Empty div for layout balance */}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes (Optional)</label>
            <textarea 
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              disabled={isLoading}
            />
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              onClick={handleClose} 
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
              {isLoading ? 'Adding...' : 'Add to Inventory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBloodModal;