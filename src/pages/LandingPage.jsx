import React from 'react';
import '../styles/LandingPage.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/Navbar'; 
import doctors from '../assets/landing_page/landing-image-1.png';
import bloodDonation from '../assets/landing_page/landing-image-2.png';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Use the Navbar Component */}
      <Navbar />

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                <span className="highlight">Every drop </span>counts,<br />
                donate blood and<br />
                make a<br />
                difference.
              </h1>
            </div>
            <div className="hero-image">
              <img src={doctors} className="doctors-img" alt="Doctors" />
            </div>
          </div>
        </div>
      </div>

      {/* Health Instructions Section */}
      <div className="health-section">
        <div className="health-container">
          <h2 className="health-title">Health Instructions</h2>
          <div className="health-content">
            <div className="health-image">
              <img src={bloodDonation} alt="Blood donation process" className="donation-img" />
            </div>
            <div className="health-text">
              <p><strong>Age:</strong> 18 - 60 years old (Some countries allow 16-17 with parental consent).</p>
              <p><strong>Weight:</strong> At least 50 kg (110 lbs).</p>
              <p><strong>Health:</strong> Must be in good health with no major illnesses.</p>
              <p><strong>Hemoglobin:</strong> Should be at least 12.5g/dL for females, 13.0 g/dL for males.</p>
              <p><strong>Blood Pressure:</strong> Should be within a normal range (not too high or low).</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Donate Blood, Save Lives – Join Our Smart Donation Network Today!</h2>
          <p className="cta-subtitle">Safe, Secure, and Efficient Blood Donation at Your Fingertips!</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;