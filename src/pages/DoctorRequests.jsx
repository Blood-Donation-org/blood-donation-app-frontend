import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/DoctorRequests.css';

const DoctorRequests = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userData'));
    if (user && user.role === 'doctor') {
      setUserData(user);
      loadDoctorRequests(user.id);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    applyFilters();
  }, [requests, filterStatus, searchTerm]);

  const loadDoctorRequests = (doctorId) => {
    // Get requests from the bloodRequests (admin's table data) where the doctor made the request
    const allRequests = JSON.parse(localStorage.getItem('bloodRequests')) || [];
    const doctorRequests = allRequests.filter(req => req.userId === doctorId);

    // If no requests exist, create sample data for the doctor
    if (doctorRequests.length === 0) {
      const currentUser = JSON.parse(localStorage.getItem('userData'));
      const sampleRequests = [
        {
          id: 'REQ001',
          userId: doctorId,
          patientName: 'John Doe',
          doctorName: currentUser?.name || 'Dr. Smith Williams',
          doctorId: currentUser?.doctorId || 'DOC001',
          bloodType: 'A+',
          wardNumber: 'W-204',
          requestDate: '2025-01-15',
          status: 'approved'
        },
        {
          id: 'REQ002',
          userId: doctorId,
          patientName: 'Jane Smith',
          doctorName: currentUser?.name || 'Dr. Smith Williams',
          doctorId: currentUser?.doctorId || 'DOC001',
          bloodType: 'O-',
          wardNumber: 'W-105',
          requestDate: '2025-01-14',
          status: 'pending'
        },
        {
          id: 'REQ003',
          userId: doctorId,
          patientName: 'Michael Johnson',
          doctorName: currentUser?.name || 'Dr. Smith Williams',
          doctorId: currentUser?.doctorId || 'DOC001',
          bloodType: 'B+',
          wardNumber: 'W-301',
          requestDate: '2025-01-13',
          status: 'not_available'
        },
        {
          id: 'REQ004',
          userId: doctorId,
          patientName: 'Sarah Wilson',
          doctorName: currentUser?.name || 'Dr. Smith Williams',
          doctorId: currentUser?.doctorId || 'DOC001',
          bloodType: 'AB+',
          wardNumber: 'W-108',
          requestDate: '2025-01-12',
          status: 'pending'
        }
      ];

      // Save sample requests to localStorage
      const updatedAllRequests = [...allRequests, ...sampleRequests];
      localStorage.setItem('bloodRequests', JSON.stringify(updatedAllRequests));
      setRequests(sampleRequests);
    } else {
      setRequests(doctorRequests);
    }
  };

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

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: {
        className: 'status-available',
        text: 'Available'
      },
      not_available: {
        className: 'status-not-available',
        text: 'Not Available'
      },
      pending: {
        className: 'status-pending',
        text: 'Pending'
      }
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`status-badge ${config.className}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
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
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request.id}>
                    <td data-label="Patient Name" className="patient-name">
                      {request.patientName}
                    </td>
                    <td data-label="Date" className="request-date">
                      {formatDate(request.requestDate)}
                    </td>
                    <td data-label="Blood Type" className="blood-type">
                      <span className="blood-type-badge">{request.bloodType}</span>
                    </td>
                    <td data-label="Status" className="status">
                      {getStatusBadge(request.status)}
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