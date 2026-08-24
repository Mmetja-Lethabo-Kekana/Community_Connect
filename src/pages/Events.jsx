import React, { useState } from 'react';
import EventCard from '../components/events/EventCard';
import { mockEvents } from '../data/mockData';

export default function Events() {
  const [filter, setFilter] = useState('All categories');
  const categories = ['All categories', 'Cleanup', 'Workshop', 'Fundraiser'];

  const filteredEvents = filter === 'All categories' 
    ? mockEvents 
    : mockEvents.filter(e => e.category === filter);

  return (
    <div>
      <div className="events-header">
        <div>
          <h1>🎯 Community Events</h1>
          <p style={{ color: '#6b7280' }}>
            Get involved, right in your neighborhood
          </p>
        </div>
        <div>
          <select 
            className="form-input"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ width: 'auto', minWidth: '160px' }}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="events-grid">
        {filteredEvents.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}