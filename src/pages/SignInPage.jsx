import axios from 'axios';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo-icon.png';
import signin from '../assets/SignIn-Register/signin.jpg';
import { UserContext } from '../context/UserContext';
import '../styles/SignInPage.css';


const SignInPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUserFromBackend } = useContext(UserContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/v1/users/login', formData);
      // Assuming response.data contains user info and token
      const userData = response.data;
      console.log(userData);
  setUserFromBackend(userData);
  navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-container">
        <div className="signin-header">
          <img 
            src={logo}
            alt="Blood donation logo" 
            className="signin-logo"
          />
          <span className="signin-brand">LifeLink</span>
        </div>

        <div className="signin-content">
          <div className="signin-card">
            <div className="signin-image-section">
              <div className="image-content">
                <img 
                  src={signin}
                  alt="Medical professionals"
                  className="signin-hero-image"
                />
              </div>
            </div>

            <div className="signin-form-section">
              <h1 className="signin-title">Welcome Back</h1>
              <p className="signin-subtitle">Sign in to your account to continue helping save lives</p>

              <form className="signin-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-input"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <div className="form-options">
                  <label className="checkbox-container">
                    <input type="checkbox" className="checkbox-input" />
                    <span className="checkbox-label">Remember me</span>
                  </label>
                  <button type="button" className="forgot-password" tabIndex={0} style={{ background: 'none', border: 'none', color: '#007bff', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}>Forgot password?</button>
                </div>

                <button type="submit" className="signin-button" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
                {error && <div className="error-message">{error}</div>}
              </form>

              <div className="signin-footer">
                <p className="signup-prompt">
                  Don't have an account? 
                  <Link to="/register" className="signup-link"> Sign up</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
