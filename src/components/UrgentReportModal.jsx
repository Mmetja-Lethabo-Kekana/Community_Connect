import React, { useState } from 'react';
import { generateReferenceNumber } from '../utils/referenceGenerator';
import { saveReport } from '../utils/reportStorage';

export default function UrgentReportModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    urgentType: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submittedReport, setSubmittedReport] = useState(null);

  const urgentTypes = [
    'Burst Water Pipe',
    'Fallen Power Line',
    'Gas Leak',
    'Sewage Overflow',
    'Structural Damage',
    'Other Urgent Issue'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Generate a reference number with URG prefix for urgent
    const refNumber = generateReferenceNumber().replace('CVP', 'URG');
    
    const newReport = {
      id: Date.now(),
      referenceNumber: refNumber,
      title: formData.urgentType,
      description: formData.description,
      category: 'Urgent',
      location: formData.location,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: 'In Progress'
    };

    // Save to localStorage
    saveReport(newReport);
    
    console.log('Urgent report submitted and saved:', newReport);
    
    setSubmittedReport(newReport);
    setSubmitted(true);
    setFormData({ title: '', description: '', location: '', urgentType: '' });
  };

  if (!isOpen) return null;

  if (submitted && submittedReport) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content urgent-modal" onClick={(e) => e.stopPropagation()}>
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚨</div>
            <h2 style={{ color: '#dc2626' }}>Urgent Report Submitted!</h2>
            <p style={{ color: '#6b7280' }}>Emergency services have been notified.</p>
            
            {/* Reference Number Display */}
            <div className="reference-display urgent-ref">
              <div className="reference-label">Your Reference Number</div>
              <div className="reference-number">{submittedReport.referenceNumber}</div>
              <p className="reference-hint">
                Use this number to track your urgent issue status
              </p>
            </div>
            
            <button 
              className="submit-btn urgent-submit-btn" 
              onClick={() => {
                setSubmitted(false);
                setSubmittedReport(null);
                onClose();
              }}
              style={{ marginTop: '16px', maxWidth: '200px', marginLeft: 'auto', marginRight: 'auto' }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content urgent-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-left">
            <span className="urgent-icon-small">🚨</span>
            <h2>URGENT REPORT</h2>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="urgent-warning">
          ⚠️ For emergencies, call 10111 immediately. This form is for urgent but non-life-threatening issues.
        </div>

        <form onSubmit={handleSubmit}>
          {/* Urgent Type - First */}
          <div className="form-group">
            <label>Type of Urgent Issue *</label>
            <select
              className="form-input form-select"
              value={formData.urgentType}
              onChange={(e) => setFormData({...formData, urgentType: e.target.value})}
              required
            >
              <option value="">Select urgent issue type</option>
              {urgentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Location - Second */}
          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter exact address or intersection"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              required
            />
          </div>

          {/* Description - Third */}
          <div className="form-group">
            <label>Description *</label>
            <textarea
              className="form-input"
              placeholder="Describe the urgent issue in detail..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>

          {/* Photo Upload - Last */}
          <div className="form-group">
            <label>Photo (Optional)</label>
            <div className="upload-zone urgent-upload">
              <span className="icon">📷</span>
              <span className="text">Click to upload a photo</span>
              <input 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }} 
                id="urgent-photo-upload"
              />
            </div>
          </div>

          <button type="submit" className="submit-btn urgent-submit-btn">
            🚨 Submit Urgent Report
          </button>
        </form>
      </div>
    </div>
  );
}