import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ReportCard from '../components/reports/ReportCard';
import UrgentReportModal from '../components/UrgentReportModal';
import { mockReports } from '../data/mockData';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom issue marker icons
const getMarkerIcon = (status) => {
  const color = status === 'Resolved' ? '#22c55e' : 
                status === 'In Progress' ? '#f59e0b' : '#ef4444';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      cursor: pointer;
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

// Component to set map view
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

export default function Dashboard({ userName }) {
  const [isUrgentModalOpen, setIsUrgentModalOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState(null);
  const [mapZoom, setMapZoom] = useState(13);
  const [selectedReport, setSelectedReport] = useState(null);
  const [viewMode, setViewMode] = useState('map');
  const [locationStatus, setLocationStatus] = useState('loading');
  const [userAddress, setUserAddress] = useState('');

  // Default location (will be used if geolocation fails)
  const defaultLocation = [-26.2041, 28.0473]; // Johannesburg, South Africa

  // Fetch detailed address from coordinates (reverse geocoding)
  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data.address) {
        const address = data.address;
        
        // Extract detailed address components
        const suburb = address.suburb || address.neighbourhood || address.quarter || '';
        const city = address.city || address.town || address.village || '';
        const municipality = address.municipality || address.city_district || address.county || '';
        const state = address.state || address.province || '';
        const country = address.country || '';
        
        // Build the full location string
        let fullLocation = '';
        
        if (suburb) {
          fullLocation += suburb;
        }
        
        if (municipality && municipality !== suburb) {
          if (fullLocation) fullLocation += ', ';
          fullLocation += municipality;
        }
        
        if (city && city !== municipality && city !== suburb) {
          if (fullLocation) fullLocation += ', ';
          fullLocation += city;
        }
        
        if (state && state !== city) {
          if (fullLocation) fullLocation += ', ';
          fullLocation += state;
        }
        
        // If we have a very specific location, use it
        if (suburb || municipality || city) {
          setUserAddress(fullLocation || 'Your location');
          setLocationStatus('found');
        } else {
          // Fallback to display name
          const displayName = data.display_name || 'Your location';
          const parts = displayName.split(',');
          const shortAddress = parts.slice(0, 3).join(',').trim();
          setUserAddress(shortAddress || 'Your location');
          setLocationStatus('found');
        }
        
        // Update the sidebar location
        const sidebarLocation = document.querySelector('.user-location');
        if (sidebarLocation) {
          sidebarLocation.textContent = `📍 ${fullLocation || 'Your location'}`;
        }
      } else {
        setUserAddress('Your location');
        setLocationStatus('found');
      }
    } catch (error) {
      console.warn('Could not fetch address:', error);
      setUserAddress('Your location');
      setLocationStatus('found');
    }
  };

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          setLocationStatus('loading');
          fetchAddress(latitude, longitude);
        },
        (error) => {
          console.warn('Geolocation error:', error);
          setMapCenter(defaultLocation);
          setLocationStatus('error');
          setUserAddress('Johannesburg, South Africa');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      setMapCenter(defaultLocation);
      setLocationStatus('error');
      setUserAddress('Johannesburg, South Africa');
    }
  }, []);

  // Generate mock locations for reports (spread around the map center)
  const reportsWithLocations = mockReports.map((report, index) => {
    const seed = index * 0.001;
    const latOffset = (Math.random() - 0.5) * 0.02 + seed;
    const lngOffset = (Math.random() - 0.5) * 0.02 + seed;
    
    const center = mapCenter || defaultLocation;
    return {
      ...report,
      latitude: center[0] + latOffset,
      longitude: center[1] + lngOffset,
    };
  });

  const allReports = reportsWithLocations;

  // Show loading state
  if (!mapCenter) {
    return (
      <div className="dashboard-container">
        <div className="loading-location">
          <div className="loading-spinner">📍</div>
          <p>Finding your exact location...</p>
          <p className="loading-subtext">Please allow location access for a more specific address</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div>
          <h1 className="welcome-title">👋 Welcome, {userName}!</h1>
          <p className="welcome-subtitle">Here's what's happening in your community</p>
        </div>
        <div className="location-badge">
          <span>📍 {userAddress || 'Finding your location...'}</span>
          <span className={`location-status ${locationStatus}`}>
            {locationStatus === 'loading' && '⏳ Loading...'}
            {locationStatus === 'found' && '✅ Found'}
            {locationStatus === 'error' && '📍 Default'}
          </span>
        </div>
      </div>

      {/* Urgent Banner */}
      <div className="urgent-banner">
        <div className="urgent-content">
          <div className="urgent-text">
            <h2>⚠️ URGENT COMMUNITY SERVICE</h2>
            <p>Quickly report urgent problems such as burst water pipes or fallen power lines.</p>
          </div>
          <button 
            className="urgent-btn" 
            onClick={() => setIsUrgentModalOpen(true)}
          >
            REPORT NOW
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="view-toggle">
        <button 
          className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
          onClick={() => setViewMode('map')}
        >
          📍 Map View
        </button>
        <button 
          className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
          onClick={() => setViewMode('list')}
        >
          📋 List View
        </button>
      </div>

      {/* Urgent Report Modal */}
      <UrgentReportModal 
        isOpen={isUrgentModalOpen} 
        onClose={() => setIsUrgentModalOpen(false)} 
      />

      {/* Map View */}
      {viewMode === 'map' && (
        <div className="map-wrapper">
          <MapContainer 
            center={mapCenter} 
            zoom={mapZoom} 
            className="map-container"
            style={{ height: '500px', width: '100%' }}
          >
            <MapController center={mapCenter} zoom={mapZoom} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {allReports.map((report) => (
              <Marker
                key={report.id}
                position={[report.latitude, report.longitude]}
                icon={getMarkerIcon(report.status)}
                eventHandlers={{
                  click: () => setSelectedReport(report),
                }}
              >
                <Popup>
                  <div className="map-popup">
                    <h4>{report.title}</h4>
                    <p><strong>Status:</strong> {report.status}</p>
                    <p><strong>Category:</strong> {report.category}</p>
                    <p><strong>Location:</strong> {report.location}</p>
                    <p><strong>Reported:</strong> {report.date}</p>
                    <button 
                      className="popup-view-btn"
                      onClick={() => setSelectedReport(report)}
                    >
                      View Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Legend */}
          <div className="map-legend">
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: '#ef4444' }}></span>
              <span>Submitted</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: '#f59e0b' }}></span>
              <span>In Progress</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: '#22c55e' }}></span>
              <span>Resolved</span>
            </div>
            <div className="legend-stats">
              <span>📍 {allReports.length} total issues</span>
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <>
          <div className="dashboard-header">
            <h1>📋 Recent Issues in Your Area</h1>
            <p>{allReports.length} total issues reported in your community</p>
          </div>
          
          <div className="reports-list">
            {allReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </>
      )}

      {/* Selected Report Details Modal */}
      {selectedReport && (
        <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Issue Details</h2>
              <button className="modal-close" onClick={() => setSelectedReport(null)}>✕</button>
            </div>
            <div className="report-detail">
              <h3>{selectedReport.title}</h3>
              <div className="report-detail-status" style={{ 
                color: selectedReport.status === 'Resolved' ? '#166534' :
                       selectedReport.status === 'In Progress' ? '#1e40af' : '#92400e'
              }}>
                <strong>Status:</strong> {selectedReport.status}
              </div>
              <p><strong>Category:</strong> {selectedReport.category}</p>
              <p><strong>Location:</strong> {selectedReport.location}</p>
              <p><strong>Reported:</strong> {selectedReport.date} at {selectedReport.time}</p>
              {selectedReport.description && (
                <>
                  <h4>Description</h4>
                  <p>{selectedReport.description}</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}