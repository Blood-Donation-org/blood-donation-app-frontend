import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import '../styles/RequestReport.css';

const RequestReport = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Get current user data
    const userData = JSON.parse(localStorage.getItem('userData'));
    setCurrentUser(userData);
    setUserRole(userData?.role);

    // Load requests based on user role
    if (userData?.role === 'admin') {
      loadAllRequests();
    } else {
      loadUserRequests(userData?.id || userData?.userId);
    }
  }, []);

  const REQUIRED_FIELDS = ['patientName', 'doctorName', 'doctorId', 'bloodType', 'wardNumber', 'status'];

  const isValidRequest = (request) => {
    return REQUIRED_FIELDS.every(field => request[field]);
  };

  const loadAllRequests = () => {
    setLoading(true);
    // Admin sees all requests from all users
    let allRequests = JSON.parse(localStorage.getItem('bloodRequests')) || [];

    // If no requests exist or requests are missing required fields, create sample data
    if (allRequests.length === 0 || allRequests.some(r => !isValidRequest(r))) {
      const sampleRequests = [
        {
          id: 'REQ001',
          userId: 'user1',
          patientName: 'John Doe',
          doctorName: 'Dr. Smith Williams',
          doctorId: 'DOC001',
          bloodType: 'A+',
          wardNumber: 'W-204',
          status: 'pending'
        },
        {
          id: 'REQ002',
          userId: 'user2',
          patientName: 'Jane Smith',
          doctorName: 'Dr. Emily Johnson',
          doctorId: 'DOC002',
          bloodType: 'O-',
          wardNumber: 'W-105',
          status: 'approved'
        },
        {
          id: 'REQ003',
          userId: 'user3',
          patientName: 'Michael Johnson',
          doctorName: 'Dr. David Brown',
          doctorId: 'DOC003',
          bloodType: 'B+',
          wardNumber: 'W-301',
          status: 'not_available'
        },
        {
          id: 'REQ004',
          userId: 'user1',
          patientName: 'Sarah Wilson',
          doctorName: 'Dr. Smith Williams',
          doctorId: 'DOC001',
          bloodType: 'AB+',
          wardNumber: 'W-108',
          status: 'pending'
        },
        {
          id: 'REQ005',
          userId: 'user4',
          patientName: 'Robert Davis',
          doctorName: 'Dr. Lisa Garcia',
          doctorId: 'DOC004',
          bloodType: 'O+',
          wardNumber: 'W-215',
          status: 'approved'
        }
      ];
      localStorage.setItem('bloodRequests', JSON.stringify(sampleRequests));
      setRequests(sampleRequests);
    } else {
      // Only show requests with all required fields
      setRequests(allRequests.filter(isValidRequest));
    }
    setLoading(false);
  };

  const loadUserRequests = (userId) => {
    setLoading(true);
    const allRequests = JSON.parse(localStorage.getItem('bloodRequests')) || [];
    let userRequests = allRequests.filter(request => request.userId === userId && isValidRequest(request));
    // If no valid requests exist, create sample data
    if (userRequests.length === 0 && userId) {
      const sampleRequests = [
        {
          id: 'REQ001',
          userId: userId,
          patientName: 'John Doe',
          doctorName: currentUser?.name || 'Dr. Smith Williams',
          doctorId: 'DOC001',
          bloodType: 'A+',
          wardNumber: 'W-204',
          status: 'approved'
        },
        {
          id: 'REQ002',
          userId: userId,
          patientName: 'Jane Smith',
          doctorName: currentUser?.name || 'Dr. Smith Williams',
          doctorId: 'DOC001',
          bloodType: 'O-',
          wardNumber: 'W-105',
          status: 'pending'
        },
        {
          id: 'REQ003',
          userId: userId,
          patientName: 'Michael Johnson',
          doctorName: currentUser?.name || 'Dr. Smith Williams',
          doctorId: 'DOC001',
          bloodType: 'B+',
          wardNumber: 'W-301',
          status: 'not_available'
        }
      ];
      // Save sample requests to localStorage
      const updatedAllRequests = [...allRequests, ...sampleRequests];
      localStorage.setItem('bloodRequests', JSON.stringify(updatedAllRequests));
      setRequests(sampleRequests);
    } else {
      setRequests(userRequests);
    }
    setLoading(false);
  };

  const handleStatusChange = (requestId, newStatus) => {
    // Update the status of the request
    const updatedRequests = requests.map(request => 
      request.id === requestId 
        ? { ...request, status: newStatus }
        : request
    );

    setRequests(updatedRequests);

    // Update localStorage
    const allRequests = JSON.parse(localStorage.getItem('bloodRequests')) || [];
    const updatedAllRequests = allRequests.map(request =>
      request.id === requestId
        ? { ...request, status: newStatus }
        : request
    );
    localStorage.setItem('bloodRequests', JSON.stringify(updatedAllRequests));
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

  const getStatusDropdown = (request) => {
    // Only allow admin to select "Available" or "Not Available"
    return (
      <select 
        value={request.status === 'approved' ? 'approved' : (request.status === 'not_available' ? 'not_available' : 'pending')}
        onChange={(e) => handleStatusChange(request.id, e.target.value)}
        className="status-dropdown"
      >
        <option value="pending">Issued</option>
        <option value="approved">Not available</option>
        <option value="not_available">Not issued</option>
      </select>
    );
  };

  if (loading) {
    return (
      <div className="request-report-page">
        <Navbar />
        <div className="loading-container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="request-report-page">
      <Navbar />
      <div className="request-report-container">
        <h1>{userRole === 'admin' ? 'All Blood Requests' : 'My Request Report'}</h1>
        
        {requests.length === 0 ? (
          <div className="no-requests">
            <p>No blood requests found.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="requests-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Doctor Name</th>
                  <th>Doctor ID</th>
                  <th>Blood Type</th>
                  <th>Ward Number</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td data-label="Patient Name">{request.patientName}</td>
                    <td data-label="Doctor Name">{request.doctorName}</td>
                    <td data-label="Doctor ID">{request.doctorId}</td>
                    <td data-label="Blood Type">{request.bloodType}</td>
                    <td data-label="Ward Number">{request.wardNumber}</td>
                    <td data-label="Status">
                      {userRole === 'admin'
                        ? getStatusDropdown(request)
                        : getStatusBadge(request.status)
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestReport;