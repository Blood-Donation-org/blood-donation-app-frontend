import React, { useState, useEffect } from 'react';
import '../styles/SplashScreen.css';
import splash from '../assets/splash-logo.png';

const SplashScreen = ({ onComplete }) => {
  const [showContent, setShowContent] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(false);
      if (onComplete) {
        onComplete();
      }
    }, 4000); // Show splash for 4 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!showContent) {
    return null;
  }

  return (
    <div className="splash-container">
      <div className="logo-container">
        {/* Your Logo Image */}
        <div className="logo-wrapper">
          <img 
            src= { splash }
            alt="LifeLink Logo" 
            className="logo-image"
          />
          
          {/* Pulse rings around logo */}
          <div className="pulse-ring pulse-ring-1"></div>
          <div className="pulse-ring pulse-ring-2"></div>
          <div className="pulse-ring pulse-ring-3"></div>
          
          {/* Floating particles */}
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
        </div>
      </div>

      {/* Logo text with letter animation */}
      <div className="logo-text">
        <span className="letter" style={{'--delay': '0.5s'}}>L</span>
        <span className="letter" style={{'--delay': '0.6s'}}>i</span>
        <span className="letter" style={{'--delay': '0.7s'}}>f</span>
        <span className="letter" style={{'--delay': '0.8s'}}>e</span>
        <span className="letter" style={{'--delay': '0.9s'}}>L</span>
        <span className="letter" style={{'--delay': '1.0s'}}>i</span>
        <span className="letter" style={{'--delay': '1.1s'}}>n</span>
        <span className="letter" style={{'--delay': '1.2s'}}>k</span>
      </div>

      {/* Loading dots */}
      <div className="loading-dots">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
};

export default SplashScreen;