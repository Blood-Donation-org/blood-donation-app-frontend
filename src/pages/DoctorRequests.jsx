
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/DoctorRequests.css';

const DoctorRequests = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [requests, setRequests] = useState([]); 
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
    // Periodically refresh requests from backend every 10 seconds
  useEffect(() => {
    if (!userData || !userData.id) return;
    const interval = setInterval(() => {
      loadDoctorRequests(userData.id);
    }, 1000); // 1 second
    return () => clearInterval(interval);
  }, [userData]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userData'));
    if (user && user.role === 'doctor') {
      setUserData(user);
      loadDoctorRequests(user.id);
    } else {
      navigate('/');
    }
  }, [navigate, location.search]); // Add location.search to dependencies

  const loadDoctorRequests = async (doctorId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/blood-requests/get-by-user/${doctorId}`);
      const userRequests = response.data.bloodRequests || response.data || [];
      setRequests(userRequests);
    } catch (error) {
      console.error('Error fetching blood requests:', error);
      setRequests([]);
    }
  };

  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...requests];

      // Filter by status
      if (filterStatus !== 'all') {
        filtered = filtered.filter(req => req.status === filterStatus);
      }

      // Filter by search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(req =>
          req.patientName.toLowerCase().includes(term) ||
          req.bloodType.toLowerCase().includes(term) ||
          req.id.toLowerCase().includes(term)
        );
      }

      setFilteredRequests(filtered);
    };
    
    applyFilters();
  }, [requests, filterStatus, searchTerm]);

  // Listen for external updates (from other pages/components) and apply them locally
  useEffect(() => {
    const handleExternalUpdate = (e) => {
      const { updatedRequest } = e?.detail || {};
      if (!updatedRequest) return;
      const id = updatedRequest._id || updatedRequest.id;
      setRequests(prev => prev.map(r => {
        const rid = r._id || r.id;
        if (rid === id) {
          return { ...r, ...updatedRequest };
        }
        return r;
      }));
    };
    window.addEventListener('requestUpdated', handleExternalUpdate);
    return () => window.removeEventListener('requestUpdated', handleExternalUpdate);
  }, []);



  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!userData) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div className="doctor-my-requests-page">
      <Navbar />
      <div className="requests-container">
        {/* Header */}
        <div className="requests-header">
          <div className="header-content">
            <h1>My Blood Requests</h1>
            <p>Track and manage your submitted blood requests</p>
          </div>
          <Link to="/contact-blood" className="new-request-btn">
            + New Request
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-number">{requests.length}</div>
            <div className="stat-label">Total Requests</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{requests.filter(r => r.status === 'pending').length}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{requests.filter(r => r.status === 'approved').length}</div>
            <div className="stat-label">Available</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{requests.filter(r => r.status === 'not_available').length}</div>
            <div className="stat-label">Not Available</div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-group">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Available</option>
              <option value="not_available">Not Available</option>
            </select>
          </div>
          <div className="search-group">
            <input
              type="text"
              placeholder="Search by patient name, blood type, or request ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Requests Table */}
        <div className="table-container">
          {filteredRequests.length === 0 ? (
            <div className="no-requests">
              <div className="no-requests-icon">📋</div>
              <h3>No requests found</h3>
              <p>
                {requests.length === 0
                  ? "You haven't submitted any blood requests yet."
                  : "No requests match your current filters."}
              </p>
              {requests.length === 0 && (
                <Link to="/contact-blood" className="create-first-btn">
                  Create Your First Request
                </Link>
              )}
            </div>
          ) : (
            <table className="doctor-requests-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Date</th>
                  <th>Blood Type</th>
                  <th>Status</th>
                  <th>Confirmation Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request._id || request.id}>
                    <td data-label="Patient Name" className="patient-name">
                      {request.patientName}
                    </td>
                    <td data-label="Date" className="request-date">
                      {formatDate(request.createdAt || request.requestDate)}
                    </td>
                    <td data-label="Blood Type" className="blood-type">
                      <span className="blood-type-badge">{request.bloodType}</span>
                    </td>
                    <td data-label="Status" className="status">
                      {request.status || 'N/A'}
                    </td>
                    <td data-label="Confirmation Status" className="confirmation-status">
                      <select
                        value={request.confirmationStatus || 'unconfirmed'}
                        onChange={async (e) => {
                          const newConfirmation = e.target.value;
                          try {
                            const requestId = request._id || request.id;
                            const url = `http://localhost:5000/api/v1/blood-requests/update-confirmation/${requestId}`;
                            const payload = { confirmationStatus: newConfirmation };
                            const res = await axios.patch(url, payload);
                            // Try to get the full updated request object from the response
                            const updatedRequest = res.data.updatedRequest || res.data.request || res.data;
                            alert(res.data.message || 'Confirmation status updated successfully');
                            setRequests(prev => prev.map(r =>
                              (r._id || r.id) === requestId
                                ? { ...r, ...updatedRequest }
                                : r
                            ));
                            if (globalThis.refreshNotifications) {
                              globalThis.refreshNotifications();
                            }
                            try {
                              window.dispatchEvent(new CustomEvent('requestUpdated', { detail: { updatedRequest } }));
                            } catch (evtErr) {
                              console.warn('Failed to dispatch requestUpdated event', evtErr);
                            }
                          } catch (error) {
                            console.error('Error updating confirmation status:', error);
                            const errorMessage = error.response?.data?.message || 'Failed to update confirmation status';
                            alert(errorMessage);
                            e.target.value = request.confirmationStatus || 'unconfirmed';
                          }
                        }}
                        className="confirmation-dropdown"
                      >
                        <option value="unconfirmed">PENDING</option>
                        <option value="confirmed">RECEIVED</option>
                        <option value="rejected">NOT RECEIVED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorRequests;