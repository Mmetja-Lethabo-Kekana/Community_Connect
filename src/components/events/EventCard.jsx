import React, { useState } from 'react';

export default function EventCard({ event }) {
  const [isSigned, setIsSigned] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

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

  return (
    <>
      <div className="event-card">
        <div className="event-icon">{event.image}</div>
        <h3>{event.title}</h3>
        <span className="category">{event.category}</span>
        <div className="details">
          <div>📍 {event.location}</div>
          <div>📅 {event.date}</div>
          <div>⏰ {event.time}</div>
        </div>
        <div className="volunteer-info">
          <span style={{ fontSize: '14px', color: '#6b7280' }}>
            {event.volunteersSigned}/{event.volunteersNeeded} volunteers
          </span>
          <button 
            className={`volunteer-btn ${isSigned ? 'signed' : ''}`}
            onClick={handleVolunteer}
            disabled={isSigned}
          >
            {isSigned ? '✅ Signed Up' : '🤝 Volunteer'}
          </button>
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
              <div>📅 {event.date}</div>
              <div>⏰ {event.time}</div>
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