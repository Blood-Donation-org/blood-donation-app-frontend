// import React, { useState } from 'react';
// import '../styles/ContactBlood.css';
// import Navbar from '../components/Navbar';
// const ContactBlood = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     location: '',
//     phone: '',
//     message: '',
//     bloodGroup: ''
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
    
//     // Simulate API call
//     try {
//       // Replace with actual API call
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       alert('Message sent successfully! We will contact you soon.');
//       setFormData({
//         name: '',
//         email: '',
//         phone: '',
//         message: '',
//         bloodGroup: ''
//       });
//     // } catch (error) {
//     //   alert('Error sending message. Please try again.');
//     // } finally {
//     //   setIsSubmitting(false);
//     // }
//     } catch{
//       alert('Error sending message. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <>
//       <Navbar/>
//       <div className="contact-blood-page">
//         <div className="contact-container">
//           <div className="contact-content">
//             <div className="image-section">
//               <div className="image-wrapper">
//                 <img 
//                   src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
//                   alt="Medical professional"
//                   className="contact-hero-image"
//                 />
//                 <div className="image-overlay">
//                   <div className="overlay-content">
//                     <h2 className="overlay-title">We're Here to Help</h2>
//                     <p className="overlay-text">
//                       Our medical team is ready to assist you with your blood donation needs. 
//                       Every request is handled with care and urgency.
//                     </p>
//                     <div className="stats-grid">
//                       <div className="stat-item">
//                         <span className="stat-number">24/7</span>
//                         <span className="stat-label">Available</span>
//                       </div>
//                       <div className="stat-item">
//                         <span className="stat-number">5000+</span>
//                         <span className="stat-label">Lives Saved</span>
//                       </div>
//                       <div className="stat-item">
//                         <span className="stat-number">100%</span>
//                         <span className="stat-label">Safe</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="form-section">
//               <div className="form-header">
//                 <h1 className="contact-title">Contact For Blood</h1>
//                 <p className="contact-subtitle">Fill following form for blood</p>
//               </div>

//               <form className="contact-form" onSubmit={handleSubmit}>
//                 <div className="form-group">
//                   <input
//                     type="text"
//                     name="name"
//                     className="form-input"
//                     placeholder="Your Name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <input
//                     type="text" 
//                     name="location"
//                     className="form-input"
//                     placeholder="Location"
//                     value={formData.location}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <input
//                     type="tel"
//                     name="phone"
//                     className="form-input"
//                     placeholder="Phone Number"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <textarea
//                     name="message"
//                     className="form-textarea"
//                     placeholder="Message"
//                     rows="4"
//                     value={formData.message}
//                     onChange={handleChange}
//                     required
//                   ></textarea>
//                 </div>

//                 <div className="form-group">
//                   <div className="select-wrapper">
//                     <select
//                       name="bloodGroup"
//                       className="form-select"
//                       value={formData.bloodGroup}
//                       onChange={handleChange}
//                       required
//                     >
//                       <option value="">Blood Group</option>
//                       {bloodGroups.map((group) => (
//                         <option key={group} value={group}>
//                           {group}
//                         </option>
//                       ))}
//                     </select>
//                     <div className="select-arrow">
//                       <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
//                         <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                       </svg>
//                     </div>
//                   </div>
//                 </div>

//                 <button 
//                   type="submit" 
//                   className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <div className="loading-spinner"></div>
//                       Sending...
//                     </>
//                   ) : (
//                     'Send Message'
//                   )}
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ContactBlood;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/ContactBlood.css';

const DoctorBloodRequest = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dtFormImage, setDtFormImage] = useState(null);
  const [dtFormPreview, setDtFormPreview] = useState(null);
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
      navigate('/login');
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

    // Check if DT form is uploaded
    if (!dtFormImage) {
      alert('Please upload the DT form image');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create request object
      const request = {
        id: 'REQ-' + Date.now().toString(36).toUpperCase(),
        doctorId: userData.id,
        doctorName: userData.name,
        requestDate: new Date().toISOString(),
        status: 'pending',
        patientDetails: {
          name: formData.patientName.trim(),
          age: parseInt(formData.patientAge),
          gender: formData.patientGender,
          bloodType: formData.bloodType
        },
        requestDetails: {
          unitsRequired: parseInt(formData.unitsRequired),
          urgency: formData.urgency,
          medicalCondition: formData.medicalCondition.trim(),
          wardNumber: formData.wardNumber.trim(),
          contactNumber: formData.contactNumber.trim(),
          surgeryDate: formData.surgeryDate || null,
          additionalNotes: formData.additionalNotes.trim(),
          hospitalName: userData.hospitalAffiliation || 'Unknown Hospital'
        },
        dtFormImage: dtFormImage
      };

      // Save to localStorage
      const existingRequests = JSON.parse(localStorage.getItem('doctorBloodRequests')) || [];
      existingRequests.push(request);
      localStorage.setItem('doctorBloodRequests', JSON.stringify(existingRequests));

      // Send notification to admin
      const adminNotifications = JSON.parse(localStorage.getItem('admin_notifications')) || [];
      const notification = {
        id: Date.now(),
        type: 'blood_request',
        doctorName: userData.name,
        hospitalName: userData.hospitalAffiliation || 'Unknown Hospital',
        requestId: request.id,
        patientName: formData.patientName,
        bloodType: formData.bloodType,
        urgency: formData.urgency,
        unitsRequired: formData.unitsRequired,
        timestamp: new Date(),
        isRead: false,
        message: `New blood request from Dr. ${userData.name} for patient ${formData.patientName}`
      };
      adminNotifications.unshift(notification);
      localStorage.setItem('admin_notifications', JSON.stringify(adminNotifications));

      // Success message
      alert('Blood request submitted successfully! You will be notified once it\'s processed.');
      
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

      // Redirect to requests page
      navigate('/doctor-requests');

    } catch (error) {
      console.error('Error submitting request:', error);
      alert('An error occurred while submitting the request. Please try again.');
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
                <p>Submit a blood request for your patient with all necessary details and DT form.</p>
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
                <h3 className="section-title">DT Form Upload</h3>
                
                <div className="upload-section">
                  <div className="upload-area">
                    {!dtFormPreview ? (
                      <div className="upload-placeholder">
                        <div className="upload-icon">📄</div>
                        <p className="upload-text">Upload DT Form Image</p>
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