import React, { useState } from 'react';

export default function PostEvent() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    date: '',
    startTime: '',
    endTime: '',
    volunteersNeeded: '',
    volunteerSignup: 'yes', // 'yes' or 'no'
    image: null,
    imagePreview: null,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submittedEvent, setSubmittedEvent] = useState(null);

  const categories = ['Cleanup', 'Workshop', 'Fundraiser', 'Social', 'Educational', 'Other'];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: file,
          imagePreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.category || !formData.location || 
        !formData.date || !formData.startTime || !formData.endTime || !formData.description) {
      alert('Please fill in all required fields.');
      return;
    }

    // Check if volunteers are needed and count is valid
    if (formData.volunteerSignup === 'yes' && (!formData.volunteersNeeded || parseInt(formData.volunteersNeeded) < 1)) {
      alert('Please enter the number of volunteers needed.');
      return;
    }

    const newEvent = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      location: formData.location,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      volunteersNeeded: formData.volunteerSignup === 'yes' ? parseInt(formData.volunteersNeeded) : 0,
      volunteersSigned: 0,
      volunteerSignup: formData.volunteerSignup,
      image: formData.imagePreview || '🎉',
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    const storedEvents = localStorage.getItem('civicPulseEvents');
    let events = [];
    if (storedEvents) {
      try {
        events = JSON.parse(storedEvents);
      } catch (e) {
        events = [];
      }
    }
    events.push(newEvent);
    localStorage.setItem('civicPulseEvents', JSON.stringify(events));
    
    console.log('Event posted:', newEvent);
    
    setSubmittedEvent(newEvent);
    setSubmitted(true);
    setFormData({
      title: '',
      description: '',
      category: '',
      location: '',
      date: '',
      startTime: '',
      endTime: '',
      volunteersNeeded: '',
      volunteerSignup: 'yes',
      image: null,
      imagePreview: null,
    });
  };

  if (submitted && submittedEvent) {
    return (
      <div className="form-container">
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
          <h2 style={{ color: '#166534' }}>Event Posted Successfully!</h2>
          <p style={{ color: '#6b7280' }}>Your community event has been published.</p>
          
          <div className="reference-display" style={{ textAlign: 'left' }}>
            <div className="reference-label">Your Event</div>
            <div className="reference-number" style={{ fontSize: '20px' }}>
              {submittedEvent.title}
            </div>
            <div style={{ marginTop: '8px', color: '#4b5563' }}>
              <div>📅 {new Date(submittedEvent.date).toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}</div>
              <div>⏰ {submittedEvent.startTime} - {submittedEvent.endTime}</div>
              <div>📍 {submittedEvent.location}</div>
              {submittedEvent.volunteerSignup === 'yes' && (
                <div>👥 {submittedEvent.volunteersNeeded} volunteers needed</div>
              )}
            </div>
            <p className="reference-hint" style={{ marginTop: '12px' }}>
              It will appear in the Events section for everyone to see.
            </p>
          </div>
          
          <button 
            className="submit-btn" 
            onClick={() => {
              setSubmitted(false);
              setSubmittedEvent(null);
            }}
            style={{ marginTop: '16px', maxWidth: '200px', marginLeft: 'auto', marginRight: 'auto' }}
          >
            Post Another Event
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>📅 Post a Community Event</h2>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>
        Share your event with the community and find volunteers!
      </p>
      
      <form onSubmit={handleSubmit}>
        {/* Event Name */}
        <div className="form-group">
          <label>Event Name *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g., Community Garden Cleanup"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>

        {/* Category */}
        <div className="form-group">
          <label>Category *</label>
          <select
            className="form-input form-select"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            required
          >
            <option value="">Select a category</option>
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
            placeholder="Enter address or venue name"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            required
          />
        </div>

        {/* Date */}
        <div className="form-group">
          <label>Date *</label>
          <input
            type="date"
            className="form-input"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            required
          />
        </div>

        {/* Start Time and End Time */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label>Start Time *</label>
            <input
              type="time"
              className="form-input"
              value={formData.startTime}
              onChange={(e) => setFormData({...formData, startTime: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>End Time *</label>
            <input
              type="time"
              className="form-input"
              value={formData.endTime}
              onChange={(e) => setFormData({...formData, endTime: e.target.value})}
              required
            />
          </div>
        </div>

        {/* What is the event about? */}
        <div className="form-group">
          <label>What is the event about? *</label>
          <textarea
            className="form-input"
            placeholder="Describe your event, what volunteers will do, what to bring, schedule, etc."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={5}
            required
          />
        </div>

        {/* Upload Image/Poster */}
        <div className="form-group">
          <label>Upload Image/Poster</label>
          <div className="upload-zone" style={{ cursor: 'pointer' }}>
            {formData.imagePreview ? (
              <div style={{ textAlign: 'center' }}>
                <img 
                  src={formData.imagePreview} 
                  alt="Event poster preview" 
                  style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
                />
                <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '8px' }}>
                  Click to change image
                </p>
              </div>
            ) : (
              <>
                <span className="icon">🖼️</span>
                <span className="text">Click to upload an image or poster</span>
                <span style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginTop: '4px' }}>
                  Supports JPG, PNG, GIF (Max 5MB)
                </span>
              </>
            )}
            <input 
              type="file" 
              accept="image/*" 
              style={{ display: 'none' }} 
              id="event-image-upload"
              onChange={handleImageChange}
            />
          </div>
        </div>

        {/* Volunteers Required */}
        <div className="form-group">
          <label>Volunteers Required?</label>
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="volunteerSignup"
                value="yes"
                checked={formData.volunteerSignup === 'yes'}
                onChange={(e) => setFormData({...formData, volunteerSignup: e.target.value})}
              />
              Yes
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="volunteerSignup"
                value="no"
                checked={formData.volunteerSignup === 'no'}
                onChange={(e) => setFormData({...formData, volunteerSignup: e.target.value})}
              />
              No
            </label>
          </div>
        </div>

        {/* How many volunteers? */}
        {formData.volunteerSignup === 'yes' && (
          <div className="form-group">
            <label>How many volunteers needed? *</label>
            <input
              type="number"
              className="form-input"
              placeholder="e.g., 10"
              min="1"
              max="100"
              value={formData.volunteersNeeded}
              onChange={(e) => setFormData({...formData, volunteersNeeded: e.target.value})}
              required={formData.volunteerSignup === 'yes'}
            />
          </div>
        )}

        <button type="submit" className="submit-btn" style={{ marginTop: '8px' }}>
          📅 Post Event
        </button>
      </form>
    </div>
  );
}