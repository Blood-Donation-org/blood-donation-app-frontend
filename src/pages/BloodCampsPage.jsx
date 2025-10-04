import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Import the Navbar component
import '../styles/BloodCampsPage.css';

const BloodCampsPage = () => {
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage to determine role
    const storedUserData = JSON.parse(localStorage.getItem('userData'));
    if (storedUserData) {
      setUserRole(storedUserData.user.role);
    }
  }, []);

  // Sample camp data - you can replace this with API data
  const camps = [
    {
      id: 1,
      name: "Colombo Blood Drive",
      location: "Colombo Town Hall",
      date: "2025-08-05",
      time: "9:00 AM - 2:00 PM",
      contact: "071-1234567",
      email: "colombo.camp@gmail.com",
      organizer: "Sri Lanka Red Cross",
      message: "Open to all blood groups. Registration required."
    },
    {
      id: 2,
      name: "Kalutara Health Camp",
      location: "Kalutara Hospital",
      date: "2025-08-10",
      time: "10:00 AM - 3:00 PM",
      contact: "077-9876543",
      email: "kalutara.camp@gmail.com",
      organizer: "LifeLink Foundation",
      message: "Special focus on O+ and O- donors."
    },
    {
      id: 3,
      name: "Gampaha Community Camp",
      location: "Gampaha Public Grounds",
      date: "2025-08-15",
      time: "8:00 AM - 1:00 PM",
      contact: "070-4567891",
      email: "gampaha.camp@gmail.com",
      organizer: "Health Ministry",
      message: "Bring ID for registration."
    },
    {
      id: 4,
      name: "Galle Blood Donation Event",
      location: "Galle Municipal Hall",
      date: "2025-08-20",
      time: "9:30 AM - 2:30 PM",
      contact: "076-6543210",
      email: "galle.camp@gmail.com",
      organizer: "Sri Lanka Army",
      message: "Free health check-up included."
    },
    {
      id: 5,
      name: "Kandy Charity Camp",
      location: "Kandy Hospital",
      date: "2025-08-25",
      time: "10:00 AM - 3:00 PM",
      contact: "071-7890123",
      email: "kandy.camp@gmail.com",
      organizer: "Rotary Club",
      message: "Donors will receive certificates."
    },
    {
      id: 6,
      name: "Matara Blood Drive",
      location: "Matara Public Park",
      date: "2025-08-30",
      time: "8:30 AM - 1:30 PM",
      contact: "077-3456789",
      email: "matara.camp@gmail.com",
      organizer: "Local NGO",
      message: "Urgent need for AB+ donors."
    }
  ];

  const handleRegister = (campName) => {
    alert(`Registration sent for ${campName}`);
    // Add your registration logic here
  };

  const handleAddCamp = () => {
    navigate('/add-camp');
  };

  return (
    <div className="blood-donation-camps-page">
      {/* Use the Navbar Component */}
      <Navbar />

      {/* Add Camp Button - Only visible for admins */}
      {userRole === 'admin' && (
        <div className="add-camp-section">
          <button 
            className="add-camp-btn"
            onClick={handleAddCamp}
          >
            Add Camp
          </button>
        </div>
      )}

      {/* Camps List Section */}
      <div className={`camps-list-section ${userRole === 'admin' ? 'with-add-btn' : ''}`}>
        <div className="camps-list-container">
          <div className="camps-grid">
            {camps.map((camp) => (
              <div key={camp.id} className="camp-card">
                <div className="camp-avatar">
                  <div className="avatar-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor"/>
                      <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="currentColor"/>
                    </svg>
                  </div>
                </div>
                
                <div className="camp-info">
                  <div className="info-row">
                    <span className="info-label">Name :</span>
                    <span className="info-value">{camp.name}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Location :</span>
                    <span className="info-value">{camp.location}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Date :</span>
                    <span className="info-value">{camp.date}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Time :</span>
                    <span className="info-value">{camp.time}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Contact :</span>
                    <span className="info-value">{camp.contact}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">E-mail :</span>
                    <span className="info-value">{camp.email}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Organizer :</span>
                    <span className="info-value">{camp.organizer}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Message :</span>
                    <span className="info-value">{camp.message}</span>
                  </div>
                </div>

                {/* Register Button - Only visible for regular users */}
                {userRole !== 'admin' && (
                  <button 
                    className="register-btn"
                    onClick={() => handleRegister(camp.name)}
                  >
                    Register
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodCampsPage;