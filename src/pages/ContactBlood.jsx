
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/ContactBlood.css';

const DoctorBloodRequest = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dtFormImage, setDtFormImage] = useState(null); // DataURL for preview
  const [dtFormPreview, setDtFormPreview] = useState(null);
  const [dtFormFile, setDtFormFile] = useState(null); // Actual file object
  const [formData, setFormData] = useState({
    // Patient Details
    patientName: '',
    patientAge: '',
    patientGender: 'male',
    bloodType: 'A+',
    
    // Request Details
    unitsRequired: '',
    urgency: 'normal',
    medicalCondition: '',
    wardNumber: '',
    contactNumber: '',
    surgeryDate: '',
    additionalNotes: ''
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userData'));
    if (user && user.role === 'doctor') {
      setUserData(user);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should not exceed 5MB');
        return;
      }

      setDtFormFile(file); // Track file object for upload

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target.result;
        setDtFormImage(imageDataUrl);
        setDtFormPreview(imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setDtFormImage(null);
    setDtFormPreview(null);
    setDtFormFile(null);
    // Reset file input
    const fileInput = document.getElementById('dtFormUpload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const validateForm = () => {
    // Check required fields
    const requiredFields = [
      'patientName', 'patientAge', 'bloodType', 'unitsRequired',
      'medicalCondition', 'wardNumber', 'contactNumber'
    ];

    for (let field of requiredFields) {
      if (!formData[field] || formData[field].trim() === '') {
        alert(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    // Validate age
    const age = parseInt(formData.patientAge);
    if (isNaN(age) || age < 1 || age > 120) {
      alert('Please enter a valid age between 1 and 120');
      return false;
    }

    // Validate units required
    const units = parseInt(formData.unitsRequired);
    if (isNaN(units) || units < 1 || units > 20) {
      alert('Please enter a valid number of units between 1 and 20');
      return false;
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
    if (!phoneRegex.test(formData.contactNumber)) {
      alert('Please enter a valid contact number');
      return false;
    }
    

    // DT form file is now optional - no validation required
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      // Prepare FormData for API
      const form = new FormData();
      form.append('patientName', formData.patientName);
      form.append('age', formData.patientAge);
      form.append('gender', formData.patientGender);
      form.append('bloodType', formData.bloodType);
      form.append('unitsRequired', formData.unitsRequired);
      form.append('urgencyLevel', formData.urgency); // backend expects urgencyLevel
      form.append('wardNumber', formData.wardNumber);
      form.append('contactNumber', formData.contactNumber);
      form.append('medicalCondition', formData.medicalCondition);
      form.append('surgeryDate', formData.surgeryDate);
      form.append('additionalNotes', formData.additionalNotes);
      form.append('status', 'pending');
      form.append('confirmationStatus', 'unconfirmed');
      // Add logged-in user ID
      if (userData && userData.id) {
        form.append('user', userData.id);
      }
      // Use the actual file object from state
      if (dtFormFile) {
        form.append('dtFormUpload', dtFormFile);
      }

      // Send to backend
      const response = await axios.post(
        'http://localhost:5000/api/v1/blood-requests/create',
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      alert(response.data.message || 'Blood request submitted successfully!');
      
      // Trigger notification refresh for admin users
      if (globalThis.refreshNotifications) {
        globalThis.refreshNotifications();
      }
      
      // Reset form
      setFormData({
        patientName: '',
        patientAge: '',
        patientGender: 'male',
        bloodType: 'A+',
        unitsRequired: '',
        urgency: 'normal',
        medicalCondition: '',
        wardNumber: '',
        contactNumber: '',
        surgeryDate: '',
        additionalNotes: ''
      });
      setDtFormImage(null);
      setDtFormPreview(null);
      setDtFormFile(null);
      // Navigate with timestamp to force refresh
      navigate('/doctor-requests?refresh=' + Date.now());
    } catch (error) {
      console.error('Error submitting request:', error);
      alert(error.response?.data?.message || 'An error occurred while submitting the request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userData) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div className="doctor-blood-request-page">
      <Navbar />
      <div className="request-container">
        <div className="request-content">
          {/* Image Section */}
          <div className="image-section">
            <div className="image-wrapper">
              <div className="request-info-card">
                <h2>Blood Request</h2>
                <p>Submit a blood request for your patient with all necessary details. DT form upload is optional.</p>
                <div className="info-stats">
                  <div className="stat-item">
                    <span className="stat-icon">🩸</span>
                    <span className="stat-text">Fast Processing</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">📋</span>
                    <span className="stat-text">Digital DT Form</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">🚨</span>
                    <span className="stat-text">Emergency Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="form-section">
            <div className="form-header">
              <h1 className="request-title">Blood Request Form</h1>
              <p className="request-subtitle">
                Please fill in all required details to submit your blood request
              </p>
            </div>

            <form onSubmit={handleSubmit} className="request-form">
              {/* Patient Details Section */}
              <div className="form-section-group">
                <h3 className="section-title">Patient Information</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Patient Name *</label>
                    <input
                      type="text"
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter patient's full name"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Age *</label>
                    <input
                      type="number"
                      name="patientAge"
                      value={formData.patientAge}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Age"
                      min="1"
                      max="120"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Gender *</label>
                    <div className="select-wrapper">
                      <select
                        name="patientGender"
                        value={formData.patientGender}
                        onChange={handleInputChange}
                        className="form-select"
                        required
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      <span className="select-arrow">▼</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Blood Type *</label>
                    <div className="select-wrapper">
                      <select
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={handleInputChange}
                        className="form-select"
                        required
                      >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                      <span className="select-arrow">▼</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Request Details Section */}
              <div className="form-section-group">
                <h3 className="section-title">Request Details</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Units Required *</label>
                    <input
                      type="number"
                      name="unitsRequired"
                      value={formData.unitsRequired}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Number of units"
                      min="1"
                      max="20"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Urgency Level *</label>
                    <div className="select-wrapper">
                      <select
                        name="urgency"
                        value={formData.urgency}
                        onChange={handleInputChange}
                        className="form-select"
                        required
                      >
                        <option value="normal">Normal</option>
                        <option value="urgent">Urgent</option>
                        <option value="critical">Critical</option>
                      </select>
                      <span className="select-arrow">▼</span>
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Ward Number *</label>
                    <input
                      type="text"
                      name="wardNumber"
                      value={formData.wardNumber}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="e.g., ICU-A, Ward 3B"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact Number *</label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="e.g., +94771234567"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Medical Condition *</label>
                  <textarea
                    name="medicalCondition"
                    value={formData.medicalCondition}
                    onChange={handleInputChange}
                    className="form-textarea"
                    placeholder="Describe the medical condition requiring blood transfusion"
                    rows="3"
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Surgery Date (if applicable)</label>
                  <input
                    type="datetime-local"
                    name="surgeryDate"
                    value={formData.surgeryDate}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Additional Notes</label>
                  <textarea
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                    className="form-textarea"
                    placeholder="Any additional information or special requirements"
                    rows="3"
                  ></textarea>
                </div>
              </div>

              {/* DT Form Upload Section */}
              <div className="form-section-group">
                <h3 className="section-title">DT Form Upload <span style={{color: '#666', fontWeight: 'normal', fontSize: '14px'}}>(Optional)</span></h3>
                
                <div className="upload-section">
                  <div className="upload-area">
                    {!dtFormPreview ? (
                      <div className="upload-placeholder">
                        <div className="upload-icon">📄</div>
                        <p className="upload-text">Upload DT Form Image (Optional)</p>
                        <p className="upload-subtext">PNG, JPG, JPEG up to 5MB</p>
                        <input
                          type="file"
                          id="dtFormUpload"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="upload-input"
                        />
                        <label htmlFor="dtFormUpload" className="upload-btn">
                          Choose File
                        </label>
                      </div>
                    ) : (
                      <div className="image-preview">
                        <img src={dtFormPreview} alt="DT Form" className="preview-image" />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="remove-image-btn"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="submit-section">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="loading-spinner"></div>
                      Submitting Request...
                    </>
                  ) : (
                    'Submit Blood Request'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorBloodRequest;