import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import logo from '../assets/logo-icon.png';
import { API_ENDPOINTS } from '../config/api';
import '../styles/ResetPasswordPage.css';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const navigate = useNavigate();
  
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setError('Invalid or missing reset token');
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validatePassword = () => {
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await axios.post(API_ENDPOINTS.USER.RESET_PASSWORD, {
        token,
        password: formData.password
      });
      
      setIsSuccess(true);
      
      // Redirect to sign in page after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
      if (err.response?.status === 400 || err.response?.status === 401) {
        setTokenValid(false);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-container">
          <div className="reset-password-header">
            <Link to="/" className="header-link">
              <img 
                src={logo}
                alt="Blood donation logo" 
                className="reset-password-logo"
              />
              <span className="reset-password-brand">LifeLink</span>
            </Link>
          </div>

          <div className="reset-password-content">
            <div className="reset-password-card">
              <div className="card-icon error-icon">
                <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#CD2F2F" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              </div>

              <h1 className="reset-password-title">Link Expired</h1>
              <p className="reset-password-subtitle">
                This password reset link is invalid or has expired. Please request a new password reset link.
              </p>

              <div className="action-buttons">
                <Link to="/forgotpswd" className="primary-button">
                  Request New Link
                </Link>
                <Link to="/" className="secondary-link">
                  Back to Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <div className="reset-password-header">
          <Link to="/" className="header-link">
            <img 
              src={logo}
              alt="Blood donation logo" 
              className="reset-password-logo"
            />
            <span className="reset-password-brand">LifeLink</span>
          </Link>
        </div>

        <div className="reset-password-content">
          <div className="reset-password-card">
            {!isSuccess ? (
              <>
                <div className="card-icon">
                  <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#CD2F2F" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>

                <h1 className="reset-password-title">Create New Password</h1>
                <p className="reset-password-subtitle">
                  Your new password must be different from previously used passwords.
                </p>

                <form className="reset-password-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="password" className="form-label">New Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="form-input"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter new password"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className="form-input"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter new password"
                      required
                    />
                  </div>

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

                  <button type="submit" className="reset-button" disabled={loading}>
                    {loading ? 'Resetting Password...' : 'Reset Password'}
                  </button>
                </form>

                <div className="reset-password-footer">
                  <Link to="/" className="back-link">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Back to Sign In
                  </Link>
                </div>
              </>
            ) : (
              <div className="success-container">
                <div className="card-icon success-icon">
                  <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#2a7d2e" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                </div>

                <h1 className="reset-password-title">Password Reset!</h1>
                <p className="reset-password-subtitle">
                  Your password has been successfully reset. You will be redirected to the sign-in page shortly.
                </p>

                <div className="success-info">
                  Redirecting in 3 seconds...
                </div>

                <Link to="/" className="primary-button">
                  Sign In Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;