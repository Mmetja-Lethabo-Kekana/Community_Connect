import React, { useState } from 'react';

export default function EventCard({ event }) {
  const [isSigned, setIsSigned] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Format time for display
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    try {
      const [hours, minutes] = timeStr.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } catch (e) {
      return timeStr;
    }
  };

  const handleVolunteer = () => {
    if (!isSigned) {
      setIsSigned(true);
      setShowConfirmation(true);
      console.log(`Signed up for: ${event.title}`);
      
      // Auto-close confirmation after 3 seconds
      setTimeout(() => {
        setShowConfirmation(false);
      }, 3000);
    }
  };

  // Determine if event has volunteer signup
  const hasVolunteerSignup = event.volunteerSignup !== 'no' && event.volunteersNeeded > 0;

  return (
    <>
      <div className="event-card">
        <div className="event-icon">{event.image || '🎉'}</div>
        <h3>{event.title}</h3>
        <span className="category">{event.category}</span>
        <div className="details">
          <div>📍 {event.location}</div>
          <div>📅 {formatDate(event.date)}</div>
          <div>⏰ {formatTime(event.startTime)} - {formatTime(event.endTime)}</div>
          {event.description && (
            <div style={{ marginTop: '8px', fontSize: '13px', color: '#6b7280' }}>
              {event.description.length > 100 
                ? event.description.substring(0, 100) + '...' 
                : event.description}
            </div>
          )}
        </div>
        <div className="volunteer-info">
          <span style={{ fontSize: '14px', color: '#6b7280' }}>
            {hasVolunteerSignup ? (
              `${event.volunteersSigned || 0}/${event.volunteersNeeded} volunteers`
            ) : (
              'No volunteer signup needed'
            )}
          </span>
          {hasVolunteerSignup && (
            <button 
              className={`volunteer-btn ${isSigned ? 'signed' : ''}`}
              onClick={handleVolunteer}
              disabled={isSigned}
            >
              {isSigned ? '✅ Signed Up' : '🤝 Volunteer'}
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="confirmation-overlay">
          <div className="confirmation-modal">
            <div className="confirmation-icon">🎉</div>
            <h3>You're Volunteering!</h3>
            <p>You've successfully signed up for:</p>
            <div className="confirmation-event-title">{event.title}</div>
            <div className="confirmation-event-details">
              <div>📍 {event.location}</div>
              <div>📅 {formatDate(event.date)}</div>
              <div>⏰ {formatTime(event.startTime)} - {formatTime(event.endTime)}</div>
            </div>
            <div className="confirmation-message">
              Thank you for making a difference in your community!
            </div>
            <button 
              className="confirmation-close-btn"
              onClick={() => setShowConfirmation(false)}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}