import axios from 'axios';
import { useEffect, useState } from 'react';
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
    setUserRole(userData?.user?.role);

    // Load requests from backend API
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/v1/blood-requests/get-all');
        console.log('Blood requests API response:', response);
        const allRequests = response.data.bloodRequests || response.data || [];
        if (userData?.user?.role === 'admin') {
          setRequests(allRequests);
        } else {
          // Try to match doctorId or userId
          const userId = userData?.id || userData?.userId;
          let userRequests;
          if (allRequests.length > 0 && 'doctorId' in allRequests[0]) {
            userRequests = allRequests.filter(r => r.doctorId === userId);
          } else if ('userId' in allRequests[0]) {
            userRequests = allRequests.filter(r => r.userId === userId);
          } else {
            userRequests = allRequests;
          }
          setRequests(userRequests);
        }
      } catch (error) {
        setRequests([]);
      }
      setLoading(false);
    };
    fetchRequests();
  }, []);

  const REQUIRED_FIELDS = ['patientName', 'doctorName', 'doctorId', 'bloodType', 'wardNumber', 'status'];

  const isValidRequest = (request) => {
    return REQUIRED_FIELDS.every(field => request[field]);
  };

  // const handleConfirmationChange = (requestId, newConfirmation) => {
  //   const updatedRequests = requests.map(request => 
  //     request.id === requestId 
  //       ? { ...request, confirmation: newConfirmation }
  //       : request
  //   );
  //   setRequests(updatedRequests);
  //   const allRequests = JSON.parse(localStorage.getItem('bloodRequests')) || [];
  //   const updatedAllRequests = allRequests.map(request =>
  //     request.id === requestId
  //       ? { ...request, confirmation: newConfirmation }
  //       : request
  //   );
  //   localStorage.setItem('bloodRequests', JSON.stringify(updatedAllRequests));
  // };

  const getConfirmationBadge = (confirmation) => {
    if (confirmation === 'received') {
      return <span className="confirmation-badge confirmation-received">Received</span>;
    }
    return <span className="confirmation-badge confirmation-not-received">Not Received</span>;
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
          status: 'pending',
          confirmation: 'not_received'
        },
        {
          id: 'REQ002',
          userId: 'user2',
          patientName: 'Jane Smith',
          doctorName: 'Dr. Emily Johnson',
          doctorId: 'DOC002',
          bloodType: 'O-',
          wardNumber: 'W-105',
          status: 'approved',
          confirmation: 'not_received'
        },
        {
          id: 'REQ003',
          userId: 'user3',
          patientName: 'Michael Johnson',
          doctorName: 'Dr. David Brown',
          doctorId: 'DOC003',
          bloodType: 'B+',
          wardNumber: 'W-301',
          status: 'not_available',
          confirmation: 'not_received'
        },
        {
          id: 'REQ004',
          userId: 'user1',
          patientName: 'Sarah Wilson',
          doctorName: 'Dr. Smith Williams',
          doctorId: 'DOC001',
          bloodType: 'AB+',
          wardNumber: 'W-108',
          status: 'pending',
          confirmation: 'not_received'
        },
        {
          id: 'REQ005',
          userId: 'user4',
          patientName: 'Robert Davis',
          doctorName: 'Dr. Lisa Garcia',
          doctorId: 'DOC004',
          bloodType: 'O+',
          wardNumber: 'W-215',
          status: 'approved',
          confirmation: 'not_received'
        }
      ];
      localStorage.setItem('bloodRequests', JSON.stringify(sampleRequests));
      setRequests(sampleRequests);
    } else {
      // Only show requests with all required fields
      setRequests(allRequests.filter(isValidRequest));
    }
    return <span className="confirmation-badge confirmation-not-received">Not Received</span>;
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
          status: 'approved',
          confirmation: 'not_received'
        },
        {
          id: 'REQ002',
          userId: userId,
          patientName: 'Jane Smith',
          doctorName: currentUser?.name || 'Dr. Smith Williams',
          doctorId: 'DOC001',
          bloodType: 'O-',
          wardNumber: 'W-105',
          status: 'pending',
          confirmation: 'not_received'
        },
        {
          id: 'REQ003',
          userId: userId,
          patientName: 'Michael Johnson',
          doctorName: currentUser?.name || 'Dr. Smith Williams',
          doctorId: 'DOC001',
          bloodType: 'B+',
          wardNumber: 'W-301',
          status: 'not_available',
          confirmation: 'not_received'
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
                  <th>User Name</th>
                  <th>DOCTOR ID</th>
                  <th>Blood Type</th>
                  <th>Ward Number</th>
                  <th>Status</th>
                  <th>Confirmation</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td data-label="Patient Name">{request.patientName}</td>
                    <td data-label="User Name">{request.user && request.user.fullName ? request.user.fullName : 'N/A'}</td>
                    <td data-label="User ID">
                      DOC-{request.user && request.user._id
                        ? request.user._id.slice(0, 4)
                        : 'N/A'}
                    </td>
                    <td data-label="Blood Type">{request.bloodType}</td>
                    <td data-label="Ward Number">{request.wardNumber}</td>
                    <td data-label="Status">
                      {userRole === 'admin'
                        ? (
                          <select
                            value={request.status === 'approved' ? 'approved' : (request.status === 'not_available' ? 'not_available' : 'pending')}
                            onChange={async (e) => {
                              const newStatus = e.target.value;
                              const confirmed = window.confirm('Are you sure you want to update the status?');
                              if (!confirmed) return;
                              try {
                                await axios.patch(`http://localhost:5000/api/v1/blood-requests/update-status/${request.id}`, {
                                  status: newStatus
                                });
                                setRequests(prev =>
                                  prev.map(r =>
                                    r.id === request.id
                                      ? { ...r, status: newStatus }
                                      : r
                                  )
                                );
                              } catch (err) {
                                // Optionally show error
                              }
                            }}
                            className="status-dropdown"
                          >
                            <option value="pending">PENDING</option>
                            <option value="approved">APPROVED</option>
                            <option value="not_available">NOT APPROVED</option>
                          </select>
                        )
                        : getStatusBadge(request.status)
                      }
                    </td>
                    <td data-label="Confirmation">
                      {getConfirmationBadge(request.confirmation || 'not_received')}
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