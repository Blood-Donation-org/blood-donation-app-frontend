import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import dropdown from '../assets/nav_bar/dropdown-icon.png';
import { UserContext } from '../context/UserContext';
import '../styles/Navbar.css';
import NotificationDropdown from './NotificationDropdown'; // import new component

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const { logout } = useContext(UserContext);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData?.user?.role) {
      setUserRole(userData.user.role);
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const renderNavigationLinks = () => {
    return (
      <>
        {/* Common links for all user types */}
        <Link to="/home" className="nav-link">Home</Link>
        <Link to="/about" className="nav-link">About Us</Link>
        
        {/* Patient/Donor specific links */}
        {userRole === 'user' && (
          <>
            {<Link to="/camps" className="nav-link">Blood Camps</Link>}
          </>
        )}
        
        {/* Doctor specific links */}
        {userRole === 'doctor' && (
          <>
            {/* <Link to="/contact-blood" className="nav-link">Request Blood</Link> */}
            <Link to="/doctor-requests" className="nav-link">My Requests</Link>
            {/* <Link to="/patient-management" className="nav-link">Patients</Link> */}
          </>
        )}
        
        {/* Admin specific links */}
        {userRole === 'admin' && (
          <>
            <Link to="/request-report" className="nav-link">All Requests</Link>
            <Link to="/stocks" className="nav-link">Blood Stocks</Link>
            <Link to="/camps" className="nav-link">Blood Camps</Link>
            <Link to="/donor-list" className="nav-link">Donors</Link>
            <Link to="/doctor-management" className="nav-link">Doctors</Link>
          </>
        )}
      </>
    );
  };

  return (
    <nav className="custom-navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <img src={logo} alt="LifeLink Logo" />
        </div>
        <div className="nav-items">
          <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            {renderNavigationLinks()}
          </div>
          
          {/* Notification Dropdown */}
          <NotificationDropdown userRole={userRole} />

          {/* Profile Dropdown */}
          <div className="profile-dropdown-container">
            <button 
              className="profile-btn"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            >
              My Profile                
              <img src={dropdown} alt="dropdown-icon" className={`drop-icon ${isProfileDropdownOpen ? 'open' : ''}`}
                width="12" 
                height="8" 
                viewBox="0 0 12 8"                  
                fill="none"/>
                <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>               
            </button>

            {isProfileDropdownOpen && (
              <div className="profile-dropdown">
                <Link to="/profile" className="dropdown-item" onClick={() => setIsProfileDropdownOpen(false)}>
                  Profile
                </Link>
                <Link to="/cpassword" className="dropdown-item" onClick={() => setIsProfileDropdownOpen(false)}>
                  Change Password
                </Link>
                {/* {userRole === 'doctor' && (
                  <Link to="/doctor-settings" className="dropdown-item" onClick={() => setIsProfileDropdownOpen(false)}>
                    Professional Settings
                  </Link>
                )} */}
                <button className="dropdown-item logout-item" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
        <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;