import React, { useState } from 'react';
import { generateReferenceNumber } from '../utils/referenceGenerator';
import { saveReport } from '../utils/reportStorage';

export default function NewReport() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submittedReport, setSubmittedReport] = useState(null);

  const categories = ['Pothole', 'Broken Streetlight', 'Graffiti', 'Traffic', 'Other'];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Generate a reference number
    const refNumber = generateReferenceNumber();
    
    // Create the report object
    const newReport = {
      id: Date.now(),
      referenceNumber: refNumber,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      location: formData.location,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: 'Submitted'
    };

    // Save to localStorage
    saveReport(newReport);
    
    console.log('Report submitted and saved:', newReport);
    
    // Store the submitted report data
    setSubmittedReport(newReport);
    setSubmitted(true);
    
    // Reset form
    setFormData({ title: '', description: '', category: '', location: '' });
  };

  if (submitted && submittedReport) {
    return (
      <div className="form-container">
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
          <h2 style={{ color: '#166534' }}>Report Submitted!</h2>
          <p style={{ color: '#6b7280' }}>Your issue has been reported to the municipality.</p>
          
          {/* Reference Number Display */}
          <div className="reference-display">
            <div className="reference-label">Your Reference Number</div>
            <div className="reference-number">{submittedReport.referenceNumber}</div>
            <p className="reference-hint">
              Use this number to track your issue status
            </p>
          </div>
          
          <button 
            className="submit-btn" 
            onClick={() => {
              setSubmitted(false);
              setSubmittedReport(null);
            }}
            style={{ marginTop: '16px', maxWidth: '200px', marginLeft: 'auto', marginRight: 'auto' }}
          >
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>📝 Submit a New Issue</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Category */}
        <div className="form-group">
          <label>Category *</label>
          <select
            className="form-input form-select"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            required
          >
            <option value="">Select an issue category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div className="form-group">
          <label>Location *</label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter street address or intersection"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            required
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description *</label>
          <textarea
            className="form-input"
            placeholder="Describe the issue in detail..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
          />
        </div>

        {/* Photo Upload */}
        <div className="form-group">
          <label>Photo (Optional)</label>
          <div className="upload-zone">
            <span className="icon">📷</span>
            <span className="text">Click to upload a photo</span>
            <input 
              type="file" 
              accept="image/*" 
              style={{ display: 'none' }} 
              id="photo-upload"
            />
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Submit Report
        </button>
      </form>
    </div>
  );
}
