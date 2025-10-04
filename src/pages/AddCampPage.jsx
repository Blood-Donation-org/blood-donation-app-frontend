import axios from 'axios';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/AddCampPage.css';

const AddCampPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    place: '',
    date: '',
    time: '',
    contactNumber: '',
    email: '',
    organizer: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.place || !formData.date || !formData.time || !formData.contactNumber) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/v1/camps/create', {
        campName: formData.name,
        place: formData.place,
        date: formData.date,
        time: formData.time,
        contactNumber: formData.contactNumber,
        emailAddress: formData.email,
        organizer: formData.organizer,
        message: formData.message
      });

      if (response.status === 201) {
        alert('Camp added successfully!');
        setFormData({
          name: '',
          place: '',
          date: '',
          time: '',
          contactNumber: '',
          email: '',
          organizer: '',
          message: ''
        });
      } else {
        alert(response.data.message || 'Failed to add camp');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert('Server error. Please try again later.');
      }
    }
  };

  return (
    <div className="add-camp-page">
      <Navbar />

      <div className="add-camp-container">
        <div className="form-section">
          <div className="form-header">
            <h1 className="form-title">Add a Camp</h1>
            <p className="form-subtitle">Details of donation camp</p>
          </div>

          <form className="camp-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Camp Name"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="place"
                value={formData.place}
                onChange={handleChange}
                placeholder="Place"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="time"
                value={formData.time}
                onChange={handleChange}
                placeholder="Time (e.g., 9:00 AM - 2:00 PM)"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Contact Number"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="organizer"
                value={formData.organizer}
                onChange={handleChange}
                placeholder="Organizer"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message / Additional Information"
                className="form-textarea"
                rows="4"
              ></textarea>
            </div>

            <button type="submit" className="update-btn">
              Add Camp
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCampPage;
