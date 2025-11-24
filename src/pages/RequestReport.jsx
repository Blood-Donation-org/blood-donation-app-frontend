import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/RequestReport.css";

const RequestReport = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

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
                  <th>Medical License</th>
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
                    <td data-label="Doctor Name">
                      {request.user && request.user.fullName
                        ? request.user.fullName
                        : "N/A"}
                    </td>
                    <td data-label="Medical License">
                      {request.doctorProfile && request.doctorProfile.medicalLicenseNumber
                        ? request.doctorProfile.medicalLicenseNumber
                        : "N/A"}
                    </td>
                    <td data-label="Blood Type">{request.bloodType}</td>
                    <td data-label="Ward Number">{request.wardNumber}</td>
                    <td data-label="Status">
                      {userRole === "admin" ? (
                        <select
                          value={
                            request.status === "approved"
                              ? "approved"
                              : request.status === "not_available"
                              ? "not_available"
                              : "pending"
                          }
                          onChange={async (e) => {
                            const newStatus = e.target.value;
                            const confirmed = window.confirm(
                              "Are you sure you want to update the status?"
                            );
                            if (!confirmed) return;
                            try {
                              await axios.patch(
                                `http://localhost:5000/api/v1/blood-requests/update-status/${request.id}`,
                                {
                                  status: newStatus,
                                }
                              );
                              setRequests((prev) =>
                                prev.map((r) =>
                                  r.id === request.id
                                    ? { ...r, status: newStatus }
                                    : r
                                )
                              );
                              
                              // Trigger notification refresh for doctor
                              if (globalThis.refreshNotifications) {
                                globalThis.refreshNotifications();
                              }
                              
                              alert('Status updated successfully');
                            } catch (err) {
                              console.error('Error updating status:', err);
                              alert('Failed to update status');
                            }
                          }}
                          className="status-dropdown"
                        >
                          <option value="pending">PENDING</option>
                          <option value="approved">ISSUED</option>
                          <option value="not_available">NOT ISSUED</option>
                        </select>
                      ) : (
                        getStatusBadge(request.status)
                      )}
                    </td>
                    <td data-label="Confirmation">
                      {getConfirmationBadge(
                        request.confirmationStatus === "confirmed" ? "received" : "not_received"
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
