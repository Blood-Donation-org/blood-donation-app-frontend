import axios from 'axios';
import { useState } from 'react';

const AddBloodModal = ({ isOpen, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    bloodType: 'A+',
    units: 1,
    donorName: '',
    donorPhone: '',
    donorAge: '',
    donationDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      bloodType: 'A+',
      units: 1,
      donorName: '',
      donorPhone: '',
      donorAge: '',
      donationDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.donorName || !formData.donorPhone || !formData.donorAge) {
      alert('Please fill in all donor details');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:5000/api/v1/blood-inventory/create', {
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
        
        // Show success message first
        alert(`Successfully added ${submittedUnits} unit(s) of ${submittedBloodType} blood to inventory`);
        
        // Reset form and close modal
        resetForm();
        onClose();
        
        // Notify parent to refresh data after modal is closed
        if (onSuccess) {
          onSuccess();
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
          </div>

          <div className="form-row">
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
            <div className="form-group">
              <label htmlFor="donorPhone">Donor Phone</label>
              <input 
                id="donorPhone"
                name="donorPhone"
                type="tel" 
                value={formData.donorPhone}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-row">
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