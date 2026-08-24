import React, { useState } from 'react';
import { findReportByReference, getAllReports } from '../utils/reportStorage';

export default function TrackIssue() {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [searchedReport, setSearchedReport] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setDebugInfo('');
    
    // Check if reference number is valid format
    const refPattern = /^(CVP|URG)-\d{4}-\d{3}$/i;
    if (!refPattern.test(referenceNumber.trim())) {
      setError('Invalid reference number format. Expected format: CVP-2026-XXX or URG-2026-XXX');
      setIsLoading(false);
      return;
    }
    
    // Simulate API delay
    setTimeout(() => {
      // Get all reports for debugging
      const allReports = getAllReports();
      console.log('All reports in TrackIssue:', allReports);
      
      // Find the report
      const found = findReportByReference(referenceNumber);
      
      if (found) {
        setSearchedReport(found);
        setError('');
        setDebugInfo(`✅ Found report: ${found.referenceNumber}`);
      } else {
        setSearchedReport(null);
        setError('No report found with this reference number. Please check and try again.');
        setDebugInfo(`❌ Not found in ${allReports.length} total reports`);
      }
      setIsLoading(false);
    }, 800);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Resolved': return '#166534';
      case 'In Progress': return '#1e40af';
      default: return '#92400e';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Resolved': return '✅';
      case 'In Progress': return '🔄';
      default: return '⏳';
    }
  };

  return (
    <div className="track-container">
      <div className="track-header">
        <h1>🔍 Track My Issue</h1>
        <p>Enter your reference number to check the status of your report</p>
      </div>

      <div className="track-search">
        <form onSubmit={handleSearch}>
          <div className="track-input-group">
            <input
              type="text"
              className="track-input"
              placeholder="Enter reference number (e.g., CVP-2026-001)"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              required
            />
            <button type="submit" className="track-btn" disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Track Issue'}
            </button>
          </div>
        </form>
        {debugInfo && (
          <div style={{ 
            marginTop: '8px', 
            fontSize: '12px', 
            color: '#6b7280',
            background: '#f3f4f6',
            padding: '4px 12px',
            borderRadius: '4px'
          }}>
            {debugInfo}
          </div>
        )}
      </div>

      {error && (
        <div className="track-error">
          <span>❌</span> {error}
        </div>
      )}

      {searchedReport && (
        <div className="track-result">
          <div className="track-result-header">
            <div>
              <h2>{searchedReport.title}</h2>
              <div className="track-ref-number">🔑 {searchedReport.referenceNumber}</div>
            </div>
            <div className="track-status-badge" style={{ backgroundColor: getStatusColor(searchedReport.status) }}>
              <span>{getStatusIcon(searchedReport.status)}</span>
              {searchedReport.status}
            </div>
          </div>

          <div className="track-details-grid">
            <div className="track-detail-item">
              <span className="track-detail-label">📍 Location</span>
              <span className="track-detail-value">{searchedReport.location}</span>
            </div>
            <div className="track-detail-item">
              <span className="track-detail-label">📅 Reported</span>
              <span className="track-detail-value">{searchedReport.date} at {searchedReport.time}</span>
            </div>
            <div className="track-detail-item">
              <span className="track-detail-label">📂 Category</span>
              <span className="track-detail-value">{searchedReport.category}</span>
            </div>
            <div className="track-detail-item">
              <span className="track-detail-label">🔄 Current Status</span>
              <span className="track-detail-value">{searchedReport.status}</span>
            </div>
          </div>

          {searchedReport.description && (
            <div className="track-description">
              <h4>Description</h4>
              <p>{searchedReport.description}</p>
            </div>
          )}

          <div className="track-timeline">
            <h4>Status Timeline</h4>
            <div className="timeline-item">
              <div className="timeline-dot" style={{ backgroundColor: '#4f46e5' }}></div>
              <div>
                <div className="timeline-title">Report Submitted</div>
                <div className="timeline-date">{searchedReport.date} at {searchedReport.time}</div>
                <div className="timeline-desc">Your issue was successfully reported to the municipality.</div>
              </div>
            </div>
            
            {searchedReport.status === 'In Progress' && (
              <div className="timeline-item">
                <div className="timeline-dot" style={{ backgroundColor: '#f59e0b' }}></div>
                <div>
                  <div className="timeline-title">In Progress</div>
                  <div className="timeline-date">{searchedReport.date}</div>
                  <div className="timeline-desc">Your issue is currently being worked on.</div>
                </div>
              </div>
            )}
            
            {searchedReport.status === 'Resolved' && (
              <>
                <div className="timeline-item">
                  <div className="timeline-dot" style={{ backgroundColor: '#f59e0b' }}></div>
                  <div>
                    <div className="timeline-title">In Progress</div>
                    <div className="timeline-date">{searchedReport.date}</div>
                    <div className="timeline-desc">Your issue is currently being worked on.</div>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot" style={{ backgroundColor: '#22c55e' }}></div>
                  <div>
                    <div className="timeline-title">Resolved</div>
                    <div className="timeline-date">{searchedReport.date}</div>
                    <div className="timeline-desc">Your issue has been resolved. Thank you for reporting!</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}