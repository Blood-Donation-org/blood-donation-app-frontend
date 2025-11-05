import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo-icon.png';
import '../styles/ForgotPasswordPage.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/v1/users/forgot-password', { email });
      setMessage(response.data.message || 'Password reset link has been sent to your email.');
      setIsSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-header">
          <Link to="/" className="header-link">
            <img 
              src={logo}
              alt="Blood donation logo" 
              className="forgot-password-logo"
            />
            <span className="forgot-password-brand">LifeLink</span>
          </Link>
        </div>

        <div className="forgot-password-content">
          <div className="forgot-password-card">
            <div className="card-icon">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#CD2F2F" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="M12 8v4"/>
                <circle cx="12" cy="16" r="0.5" fill="#CD2F2F"/>
              </svg>
            </div>

            <h1 className="forgot-password-title">Forgot Password?</h1>
            <p className="forgot-password-subtitle">
              No worries! Enter your email address and we'll send you a link to reset your password.
            </p>

            {!isSuccess ? (
              <form className="forgot-password-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    required
                  />
                </div>

                <button type="submit" className="reset-button" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>

                {error && (
                  <div className="message-box error-message">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <circle cx="12" cy="16" r="0.5" fill="currentColor"/>
                    </svg>
                    {error}
                  </div>
                )}
              </form>
            ) : (
              <div className="success-container">
                <div className="message-box success-message">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                  {message}
                </div>
                <p className="success-info">
                  Please check your email inbox (and spam folder) for the password reset link. 
                  The link will expire in 1 hour.
                </p>
              </div>
            )}

            <div className="forgot-password-footer">
              <Link to="/" className="back-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;