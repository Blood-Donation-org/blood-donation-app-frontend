import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo-icon.png";
import signin from "../assets/SignIn-Register/signin.jpg";
import { API_ENDPOINTS } from "../config/api";
import { UserContext } from "../context/UserContext";
import "../styles/SignInPage.css";

const SignInPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUserFromBackend } = useContext(UserContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        API_ENDPOINTS.USER.LOGIN,
        formData
      );
      // Assuming response.data contains user info and token
      const userData = response.data;
      console.log(userData);
      setUserFromBackend(userData);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-container">
        <div className="signin-header">
          <img src={logo} alt="Blood donation logo" className="signin-logo" />
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
              <p className="signin-subtitle">
                Sign in to your account to continue helping save lives
              </p>

              <form className="signin-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
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
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      className="form-input password-with-toggle"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={toggleShowPassword}
                      className="password-toggle-button"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3-11-8 1.1-2.84 2.9-5.22 5.07-6.84" />
                          <path d="M1 1l22 22" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="form-options">
                  <label className="checkbox-container">
                    <input type="checkbox" className="checkbox-input" />
                    <span className="checkbox-label">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="forgot-password"
                    tabIndex={0}
                    style={{
                      background: "none",
                      border: "none",    
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    <Link to="/forgotpswd" className="forgot-password">
                      Forgot password?
                    </Link>
                  </button>
                </div>
                <button
                  type="submit"
                  className="signin-button"
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
                {error && <div className="error-message">{error}</div>}
              </form>

              <div className="signin-footer">
                <p className="signup-prompt">
                  Don't have an account?
                  <Link to="/register" className="signup-link">
                    {" "}
                    Sign up
                  </Link>
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
