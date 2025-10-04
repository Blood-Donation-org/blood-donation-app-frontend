import React from 'react';
import '../styles/AboutUsPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/Navbar'; // Import the Navbar component
import doctorsTeam from '../assets/about_us/about-image-1.png'; // You'll need to add this image

const AboutUs = () => {
  return (
    <div className="about-page">
      {/* Use the Navbar Component */}
      <Navbar />

      {/* Hero Section with Doctors Image */}
      <div className="about-hero-section">
        <div className="about-hero-container">
          <div className="doctors-team-image">
            <img src={doctorsTeam} className="team-img" alt="Medical Team" />
          </div>
        </div>
      </div>

      {/* Vision and Mission Section */}
      <div className="vision-mission-section">
        <div className="vision-mission-container">
          
          {/* Our Vision */}
          <div className="vision-card">
            <div className="card-header">
              <h2 className="card-title">Our Vision</h2>
            </div>
            <div className="card-content">
              <p className="card-text">
                To create a seamless, technology-driven blood donation ecosystem 
                that ensures timely access to safe blood for every patient in need.
              </p>
            </div>
          </div>

          {/* Our Mission */}
          <div className="mission-card">
            <div className="card-header">
              <h2 className="card-title">Our Mission</h2>
            </div>
            <div className="card-content">
              <p className="card-text">
                Our mission is to connect donors, hospitals, and blood banks through 
                a smart, secure, and efficient system to ensure timely and safe blood 
                availability for those in need.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutUs;