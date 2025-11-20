import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/BloodPacketList.css';

const BloodPacketList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [bloodPackets, setBloodPackets] = useState([]);
  const [filteredPackets, setFilteredPackets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBloodType, setFilterBloodType] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    // Check if there's a blood type filter in URL params
    const urlFilter = searchParams.get('filter');
    if (urlFilter) {
      setFilterBloodType(urlFilter);
    }
  }, [searchParams]);

  const fetchBloodPackets = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5000/api/v1/blood-inventory/');
      const packets = response.data.bloodInventory || [];
      setBloodPackets(packets);
      setFilteredPackets(packets);
    } catch (error) {
      console.error('Error fetching blood packets:', error);
      setBloodPackets([]);
      setFilteredPackets([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBloodPackets();
  }, []);

  useEffect(() => {
    let filtered = bloodPackets.filter(packet => {
      const matchesSearch = 
        packet.bloodPacketId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        packet.donerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        packet.donerphone?.includes(searchQuery);
      
      const matchesBloodType = filterBloodType === '' || packet.bloodType === filterBloodType;
      
      return matchesSearch && matchesBloodType;
    });

    // Sort packets
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'bloodType':
        filtered.sort((a, b) => a.bloodType.localeCompare(b.bloodType));
        break;
      case 'units':
        filtered.sort((a, b) => b.units - a.units);
        break;
      default:
        break;
    }

    setFilteredPackets(filtered);
  }, [bloodPackets, searchQuery, filterBloodType, sortBy]);

  const handleDeletePacket = async (packetId, bloodPacketId) => {
    if (!window.confirm(`Are you sure you want to delete blood packet ${bloodPacketId}?`)) {
      return;
    }

    try {
      setIsLoading(true);
      await axios.delete(`http://localhost:5000/api/v1/blood-inventory/delete/${packetId}`);
      alert('Blood packet deleted successfully');
      await fetchBloodPackets();
    } catch (error) {
      console.error('Error deleting blood packet:', error);
      alert('Error deleting blood packet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getBloodTypeClass = (bloodType) => {
    return `blood-type-${bloodType.toLowerCase().replace(/[+-]/g, '')}`;
  };

  const getStockStatusClass = (units) => {
    if (units < 1) return 'out-of-stock';
    if (units < 3) return 'low-stock';
    if (units < 5) return 'medium-stock';
    return 'in-stock';
  };

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  return (
    <div className="blood-packet-list-page">
      <Navbar />
      
      <div className="packet-list-container">
        <div className="packet-list-content">
          <div className="page-header">
            <div className="header-info">
              <h1 className="page-title">Blood Packet Management</h1>
              <p className="page-subtitle">
                Manage individual blood packets • Total: {filteredPackets.length} packets
              </p>
            </div>
            <button 
              className="back-btn"
              onClick={() => navigate('/stock')}
              disabled={isLoading}
            >
              ← Back to Stock Summary
            </button>
          </div>

          <div className="filters-section">
            <div className="search-container">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search by Packet ID, Donor Name, or Phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <span className="search-icon">🔍</span>
              </div>
            </div>

            <div className="filter-controls">
              <div className="filter-group">
                <label>Blood Type:</label>
                <select 
                  value={filterBloodType} 
                  onChange={(e) => setFilterBloodType(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Types</option>
                  {bloodTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Sort by:</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="bloodType">Blood Type</option>
                  <option value="units">Units (High to Low)</option>
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading blood packets...</p>
            </div>
          ) : (
            <div className="packets-grid">
              {filteredPackets.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📦</div>
                  <h3>No blood packets found</h3>
                  <p>
                    {bloodPackets.length === 0 
                      ? "No blood packets have been added yet." 
                      : "No packets match your search criteria."
                    }
                  </p>
                  <button 
                    className="add-blood-btn"
                    onClick={() => navigate('/stock')}
                  >
                    Go to Stock Management
                  </button>
                </div>
              ) : (
                filteredPackets.map((packet) => (
                  <div key={packet.id} className={`packet-card ${getStockStatusClass(packet.units)}`}>
                    <div className="packet-header">
                      <div className="packet-id">
                        <span className="id-label">ID:</span>
                        <span className="id-value">{packet.bloodPacketId}</span>
                      </div>
                      <div className={`blood-type-badge ${getBloodTypeClass(packet.bloodType)}`}>
                        {packet.bloodType}
                      </div>
                    </div>

                    <div className="packet-details">
                      <div className="detail-row">
                        <span className="detail-label">Units:</span>
                        <span className={`detail-value units ${getStockStatusClass(packet.units)}`}>
                          {packet.units}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Donor:</span>
                        <span className="detail-value">{packet.donerName}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Phone:</span>
                        <span className="detail-value">{packet.donerphone}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Age:</span>
                        <span className="detail-value">{packet.donerAge} years</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Donation Date:</span>
                        <span className="detail-value">{packet.donationDate}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Added:</span>
                        <span className="detail-value">
                          {new Date(packet.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {packet.Notes && (
                        <div className="detail-row notes">
                          <span className="detail-label">Notes:</span>
                          <span className="detail-value">{packet.Notes}</span>
                        </div>
                      )}
                    </div>

                    <div className="packet-actions">
                      <button 
                        className="issue-btn"
                        disabled={packet.units === 0}
                        onClick={() => {
                          // You can implement issue functionality here or navigate to issue page
                          navigate(`/stock`);
                        }}
                      >
                        Issue Blood
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeletePacket(packet.id, packet.bloodPacketId)}
                        disabled={isLoading}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BloodPacketList;