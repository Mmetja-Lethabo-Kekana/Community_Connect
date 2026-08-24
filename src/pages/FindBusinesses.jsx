// src/pages/FindBusinesses.jsx

import React, { useState, useEffect } from 'react';
import { 
  businessCategories, 
  getAllBusinesses, 
  searchBusinesses, 
  getBusinessesByCategory,
  getTopRatedBusinesses,
  getFeaturedBusinesses
} from '../utils/businessStorage';

export default function FindBusinesses() {
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [sortBy, setSortBy] = useState('rating'); // 'rating', 'name', 'recent'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFeatured, setShowFeatured] = useState(false);

  // Load businesses
  useEffect(() => {
    loadBusinesses();
    getUserLocation();
  }, []);

  const loadBusinesses = () => {
    const all = getAllBusinesses();
    setBusinesses(all);
    setFilteredBusinesses(all);
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Default location (Johannesburg)
          setUserLocation({ lat: -26.2041, lng: 28.0473 });
        }
      );
    }
  };

  // Filter and sort businesses when category, search, or sort changes
  useEffect(() => {
    let results = businesses;
    
    // Filter by category
    if (selectedCategory !== 'All Categories') {
      results = results.filter(b => b.category === selectedCategory);
    }
    
    // Filter by search
    if (searchQuery.trim()) {
      results = searchBusinesses(searchQuery);
    }
    
    // Sort results
    results = sortBusinesses(results, sortBy);
    
    setFilteredBusinesses(results);
  }, [selectedCategory, searchQuery, businesses, sortBy]);

  const sortBusinesses = (items, sortType) => {
    const sorted = [...items];
    switch(sortType) {
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'recent':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return sorted;
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Food & Restaurants': '🍽️',
      'Internet Cafes': '💻',
      'Shops': '🛍️',
      'Hair & Beauty': '💇',
      'Repairs': '🔧',
      'Health': '🏥',
      'Education': '📚',
      'Financial Services': '💰',
      'Other': '📌'
    };
    return icons[category] || '🏪';
  };

  const renderStars = (rating) => {
    if (!rating) return '☆☆☆☆☆';
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return '⭐'.repeat(fullStars) + (halfStar ? '☆' : '') + '☆'.repeat(emptyStars);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Food & Restaurants': '#ef4444',
      'Internet Cafes': '#3b82f6',
      'Shops': '#8b5cf6',
      'Hair & Beauty': '#ec4899',
      'Repairs': '#f59e0b',
      'Health': '#10b981',
      'Education': '#06b6d4',
      'Financial Services': '#6366f1',
      'Other': '#6b7280'
    };
    return colors[category] || '#6b7280';
  };

  const handleClearFilters = () => {
    setSelectedCategory('All Categories');
    setSearchQuery('');
    setSortBy('rating');
    setShowFeatured(false);
  };

  return (
    <div className="business-directory">
      <div className="business-header">
        <div>
          <h1>🏪 Find Businesses Near Me</h1>
          <p style={{ color: '#6b7280' }}>
            Discover local businesses in your community
          </p>
        </div>
        <div className="business-stats">
          <span className="stat-badge">
            📊 {businesses.length} total businesses
          </span>
          {userLocation && (
            <span className="stat-badge">
              📍 Near you
            </span>
          )}
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="business-controls">
        <div className="search-box">
          <input
            type="text"
            className="form-input"
            placeholder="🔍 Search businesses by name, category, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1 }}
          />
          {searchQuery && (
            <button 
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>
        
        <div className="filter-controls">
          <select
            className="form-input form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ minWidth: '160px' }}
          >
            <option value="All Categories">All Categories</option>
            {businessCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            className="form-input form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ minWidth: '140px' }}
          >
            <option value="rating">Sort by Rating</option>
            <option value="name">Sort by Name</option>
            <option value="recent">Most Recent</option>
          </select>

          <button 
            className="clear-filters-btn"
            onClick={handleClearFilters}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="view-controls">
        <div className="results-count">
          {filteredBusinesses.length} businesses found
          {selectedCategory !== 'All Categories' && ` in ${selectedCategory}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </div>
        <div className="view-toggle-buttons">
          <button 
            className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            📐 Grid
          </button>
          <button 
            className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            📋 List
          </button>
        </div>
      </div>

      {/* Business Grid/List */}
      {filteredBusinesses.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏪</div>
          <h3>No businesses found</h3>
          <p style={{ color: '#6b7280' }}>
            {businesses.length === 0 
              ? 'Be the first to add a business to the directory!' 
              : 'Try adjusting your search or filters'}
          </p>
          {businesses.length > 0 && (
            <button 
              className="submit-btn" 
              onClick={handleClearFilters}
              style={{ maxWidth: '200px', margin: '16px auto 0' }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className={`business-${viewMode}`}>
          {filteredBusinesses.map((business) => (
            <div 
              key={business.id} 
              className={`business-card ${viewMode === 'list' ? 'list-view' : ''}`}
              onClick={() => setSelectedBusiness(business)}
            >
              <div className="business-card-image">
                {business.image && business.image.startsWith('data:image') ? (
                  <img src={business.image} alt={business.name} />
                ) : (
                  <div className="business-emoji-icon" style={{ fontSize: viewMode === 'list' ? '32px' : '48px' }}>
                    {business.image || '🏪'}
                  </div>
                )}
                {business.rating && (
                  <div className="business-rating-badge">
                    ⭐ {business.rating}
                  </div>
                )}
              </div>
              <div className="business-card-content">
                <h3>{business.name}</h3>
                <span 
                  className="business-category"
                  style={{ backgroundColor: getCategoryColor(business.category) + '20', color: getCategoryColor(business.category) }}
                >
                  {getCategoryIcon(business.category)} {business.category}
                </span>
                <div className="business-card-address">📍 {business.address}</div>
                {business.phone && (
                  <div className="business-card-phone">📞 {business.phone}</div>
                )}
                {viewMode === 'list' && business.description && (
                  <div className="business-card-description">
                    {business.description.length > 150 
                      ? business.description.substring(0, 150) + '...' 
                      : business.description}
                  </div>
                )}
                <div className="business-card-footer">
                  <div>
                    <span className="business-rating">
                      {renderStars(business.rating)} {business.rating || 'No rating'}
                    </span>
                    {business.reviews && (
                      <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '4px' }}>
                        ({business.reviews} reviews)
                      </span>
                    )}
                  </div>
                  <button className="view-details-btn">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Business Details Modal */}
      {selectedBusiness && (
        <div className="modal-overlay" onClick={() => setSelectedBusiness(null)}>
          <div className="modal-content business-detail-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedBusiness.name}</h2>
              <button className="modal-close" onClick={() => setSelectedBusiness(null)}>✕</button>
            </div>
            
            <div className="business-detail-modal">
              <div className="business-detail-header">
                {selectedBusiness.image && selectedBusiness.image.startsWith('data:image') ? (
                  <img 
                    src={selectedBusiness.image} 
                    alt={selectedBusiness.name} 
                    className="business-detail-image"
                  />
                ) : (
                  <div className="business-detail-emoji">
                    {selectedBusiness.image || '🏪'}
                  </div>
                )}
                <div className="business-detail-summary">
                  <div className="business-detail-category">
                    {getCategoryIcon(selectedBusiness.category)} {selectedBusiness.category}
                  </div>
                  <div className="business-detail-rating">
                    {renderStars(selectedBusiness.rating)} 
                    <span className="rating-number">{selectedBusiness.rating || 'No rating'}</span>
                    {selectedBusiness.reviews && (
                      <span className="review-count">({selectedBusiness.reviews} reviews)</span>
                    )}
                  </div>
                  <div className="business-detail-location">
                    📍 {selectedBusiness.address}
                  </div>
                </div>
              </div>

              <div className="business-detail-info">
                <div className="detail-row">
                  <span className="detail-label">📝 Description</span>
                  <span className="detail-value">{selectedBusiness.description}</span>
                </div>
                {selectedBusiness.phone && (
                  <div className="detail-row">
                    <span className="detail-label">📞 Phone</span>
                    <span className="detail-value">
                      <a href={`tel:${selectedBusiness.phone}`}>{selectedBusiness.phone}</a>
                    </span>
                  </div>
                )}
                {selectedBusiness.website && (
                  <div className="detail-row">
                    <span className="detail-label">🌐 Website</span>
                    <span className="detail-value">
                      <a href={selectedBusiness.website} target="_blank" rel="noopener noreferrer">
                        {selectedBusiness.website}
                      </a>
                    </span>
                  </div>
                )}
                {selectedBusiness.email && (
                  <div className="detail-row">
                    <span className="detail-label">📧 Email</span>
                    <span className="detail-value">
                      <a href={`mailto:${selectedBusiness.email}`}>{selectedBusiness.email}</a>
                    </span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="detail-label">📅 Added</span>
                  <span className="detail-value">
                    {new Date(selectedBusiness.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <div className="business-detail-actions">
                <button 
                  className="submit-btn"
                  onClick={() => {
                    // Could add functionality to get directions
                    alert(`Getting directions to ${selectedBusiness.name}`);
                  }}
                >
                  🗺️ Get Directions
                </button>
                <button 
                  className="submit-btn" 
                  style={{ background: '#6b7280' }}
                  onClick={() => {
                    // Could add functionality to call
                    if (selectedBusiness.phone) {
                      window.location.href = `tel:${selectedBusiness.phone}`;
                    } else {
                      alert('No phone number available');
                    }
                  }}
                >
                  📞 Call Business
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}