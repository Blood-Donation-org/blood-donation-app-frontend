
import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import pollingService from "../services/pollingService";
import "../styles/RequestReport.css";

const RequestReport = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [hasNewUpdate, setHasNewUpdate] = useState(false);

  useEffect(() => {
    // Get current user data
    const userData = JSON.parse(localStorage.getItem("userData"));
    setCurrentUser(userData);
    setUserRole(userData?.role); // Fixed: use userData.role instead of userData.user.role

    

    // Load requests from backend API
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/blood-requests/get-all"
        );
        console.log("Blood requests API response:", response);
        const allRequests = response.data.bloodRequests || response.data || [];
        if (userData?.role === "admin") {
          setRequests(allRequests);
        } else {
          // Filter requests for current user (doctor)
          const userId = userData?.id;
          const userRequests = allRequests.filter((request) => {
            return request.user && request.user._id === userId;
          });
          setRequests(userRequests);
        }
      } catch (error) {
        console.error('Error fetching blood requests:', error);
        setRequests([]);
      }
      setLoading(false);
    };
    fetchRequests();
  }, []);

  // Listen for external updates and apply them to this page's state
  useEffect(() => {
    const onRequestUpdated = (e) => {
      const { updatedRequest } = e?.detail || {};
      if (!updatedRequest) return;
      const id = updatedRequest._id || updatedRequest.id;
      setRequests(prev => prev.map(r => {
        if (r.id === id || r._id === id) {
          return { ...r, ...updatedRequest };
        }
        return r;
      }));
    };
    window.addEventListener('requestUpdated', onRequestUpdated);
    return () => window.removeEventListener('requestUpdated', onRequestUpdated);
  }, []);

  const getConfirmationBadge = (confirmation) => {
    if (confirmation === "received") {
      return (
        <span className="confirmation-badge confirmation-received">
          Received
        </span>
      );
    }
    return (
      <span className="confirmation-badge confirmation-not-received">
        Not Received
      </span>
    );
  };

    // Periodically refresh requests from backend every 10 seconds
  useEffect(() => {
    if (!currentUser) return;
    const fetchRequests = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/blood-requests/get-all");
        const allRequests = response.data.bloodRequests || response.data || [];
        if (currentUser?.role === "admin") {
          setRequests(allRequests);
        } else {
          const userId = currentUser?.id;
          const userRequests = allRequests.filter((request) => {
            return request.user && request.user._id === userId;
          });
          setRequests(userRequests);
        }
      } catch (error) {
        // Silent fail
      }
    };
    const interval = setInterval(fetchRequests, 1000); // 1 second
    return () => clearInterval(interval);
  }, [currentUser]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: {
        className: "status-available",
        text: "Issued",
      },
      not_available: {
        className: "status-not-available",
        text: "Not Issued",
      },
      pending: {
        className: "status-pending",
        text: "Pending",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span className={`status-badge ${config.className}`}>{config.text}</span>
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
        <h1>
          {userRole === "admin" ? "All Blood Requests" : "My Request Report"}
        </h1>
        {hasNewUpdate && (
          <div className="update-indicator" style={{
            marginTop: '10px',
            marginBottom: '20px',
            padding: '8px 12px',
            backgroundColor: '#4CAF50',
            color: 'white',
            borderRadius: '4px',
            fontSize: '14px',
            display: 'inline-block'
          }}>
            ✓ New updates received
          </div>
        )}

        {requests.length === 0 ? (
          <div className="no-requests">
            <p>No blood requests found.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="doctor-requests-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Date</th>
                  <th>Doctor Name</th>
                  <th>Medical License</th>
                  <th>Blood Type</th>
                  <th>Ward Number</th>
                  <th>Status</th>
                  <th>Confirmation Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td data-label="Patient Name" className="patient-name">{request.patientName}</td>
                    <td data-label="Date" className="request-date">{request.createdAt ? new Date(request.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}</td>
                    <td data-label="Doctor Name">{request.user && request.user.fullName ? request.user.fullName : "N/A"}</td>
                    <td data-label="Medical License">{request.doctorProfile && request.doctorProfile.medicalLicenseNumber ? request.doctorProfile.medicalLicenseNumber : "N/A"}</td>
                    <td data-label="Blood Type" className="blood-type"><span className="blood-type-badge">{request.bloodType}</span></td>
                    <td data-label="Ward Number">{request.wardNumber}</td>
                    <td data-label="Status" className="status">
                      {userRole === "admin" ? (
                        <select
                          value={request.status || 'pending'}
                          onChange={async (e) => {
                            const newStatus = e.target.value;
                            const confirmed = window.confirm(
                              "Are you sure you want to update the status?"
                            );
                            if (!confirmed) return;
                            try {
                              const res = await axios.patch(
                                `http://localhost:5000/api/v1/blood-requests/update-status/${request.id}`,
                                {
                                  status: newStatus,
                                }
                              );
                              const updatedRequest = res.data.updatedRequest || res.data.request || res.data;
                              setRequests((prev) =>
                                prev.map((r) =>
                                  r.id === request.id
                                    ? { ...r, ...updatedRequest }
                                    : r
                                )
                              );
                              if (globalThis.refreshNotifications) {
                                globalThis.refreshNotifications();
                              }
                              alert('Status updated successfully');
                              try {
                                window.dispatchEvent(new CustomEvent('requestUpdated', { detail: { updatedRequest } }));
                              } catch (evtErr) {
                                console.warn('Failed to dispatch requestUpdated event', evtErr);
                              }
                            } catch (err) {
                              console.error('Error updating status:', err);
                              alert('Failed to update status');
                            }
                          }}
                          className="status-dropdown"
                        >
                          <option value="pending">PENDING</option>
                          <option value="approved">AVAILABLE</option>
                          <option value="not_available">NOT AVAILABLE</option>
                        </select>
                      ) : (
                        <span className={`status-badge ${
                          request.status === 'approved'
                            ? 'status-available'
                            : request.status === 'not_available'
                            ? 'status-not-available'
                            : 'status-pending'
                        }`}>
                          {request.status === 'approved'
                            ? 'Available'
                            : request.status === 'not_available'
                            ? 'Not Available'
                            : 'Pending'}
                        </span>
                      )}
                    </td>
                    <td data-label="Confirmation Status" className="confirmation-status">
                      {userRole === "admin" ? (
                        <span className={`confirmation-badge ${
                          request.confirmationStatus === 'confirmed'
                            ? 'confirmation-received'
                            : request.confirmationStatus === 'rejected'
                            ? 'confirmation-not-received'
                            : 'confirmation-not-received'
                        }`}>
                          {request.confirmationStatus === 'confirmed'
                            ? 'Received'
                            : request.confirmationStatus === 'rejected'
                            ? 'Not Received'
                            : 'Not Received'}
                        </span>
                      ) : (
                        <span className={`confirmation-badge ${
                          request.confirmationStatus === 'confirmed'
                            ? 'confirmation-received'
                            : request.confirmationStatus === 'rejected'
                            ? 'confirmation-not-received'
                            : 'confirmation-not-received'
                        }`}>
                          {request.confirmationStatus === 'confirmed'
                            ? 'Received'
                            : request.confirmationStatus === 'rejected'
                            ? 'Not Received'
                            : 'Not Received'}
                        </span>
                      )}
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
