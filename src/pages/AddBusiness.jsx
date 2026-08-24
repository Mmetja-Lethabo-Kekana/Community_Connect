import React, { useState } from 'react';
import { businessCategories, saveBusiness } from '../utils/businessStorage';

export default function AddBusiness() {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    address: '',
    phone: '',
    website: '',
    email: '',
    image: null,
    imagePreview: null,
    latitude: '',
    longitude: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submittedBusiness, setSubmittedBusiness] = useState(null);

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
    
    if (!formData.name || !formData.category || !formData.address) {
      alert('Please fill in all required fields.');
      return;
    }

    // Try to get user's location for the business
    let lat = formData.latitude;
    let lng = formData.longitude;
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          lat = position.coords.latitude.toString();
          lng = position.coords.longitude.toString();
        },
        () => {
          // Use default or user-entered location
        }
      );
    }

    const newBusiness = {
      id: Date.now(),
      name: formData.name,
      category: formData.category,
      description: formData.description || 'No description provided.',
      address: formData.address,
      phone: formData.phone || '',
      website: formData.website || '',
      email: formData.email || '',
      image: formData.imagePreview || '🏪',
      latitude: parseFloat(lat) || 0,
      longitude: parseFloat(lng) || 0,
      createdAt: new Date().toISOString(),
      rating: 0,
      reviews: [],
    };

    saveBusiness(newBusiness);
    console.log('Business added:', newBusiness);
    
    setSubmittedBusiness(newBusiness);
    setSubmitted(true);
    setFormData({
      name: '',
      category: '',
      description: '',
      address: '',
      phone: '',
      website: '',
      email: '',
      image: null,
      imagePreview: null,
      latitude: '',
      longitude: '',
    });
  };

  if (submitted && submittedBusiness) {
    return (
      <div className="form-container">
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
          <h2 style={{ color: '#166534' }}>Business Added Successfully!</h2>
          <p style={{ color: '#6b7280' }}>Your business is now listed in the directory.</p>
          
          <div className="reference-display" style={{ textAlign: 'left' }}>
            <div className="reference-label">Your Business</div>
            <div className="reference-number" style={{ fontSize: '20px' }}>
              {submittedBusiness.name}
            </div>
            <div style={{ marginTop: '8px', color: '#4b5563' }}>
              <div>📂 {submittedBusiness.category}</div>
              <div>📍 {submittedBusiness.address}</div>
            </div>
          </div>
          
          <button 
            className="submit-btn" 
            onClick={() => {
              setSubmitted(false);
              setSubmittedBusiness(null);
            }}
            style={{ marginTop: '16px', maxWidth: '200px', marginLeft: 'auto', marginRight: 'auto' }}
          >
            Add Another Business
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>🏪 Add Your Business</h2>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>
        List your business in the community directory!
      </p>
      
      <form onSubmit={handleSubmit}>
        {/* Business Name */}
        <div className="form-group">
          <label>Business Name *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g., Joe's Coffee Shop"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
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
            {businessCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            className="form-input"
            placeholder="Tell the community about your business..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={3}
          />
        </div>

        {/* Address */}
        <div className="form-group">
          <label>Address *</label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter your business address"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            required
          />
        </div>

        {/* Phone */}
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            className="form-input"
            placeholder="e.g., 012 345 6789"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>

        {/* Website */}
        <div className="form-group">
          <label>Website</label>
          <input
            type="url"
            className="form-input"
            placeholder="e.g., https://yourbusiness.com"
            value={formData.website}
            onChange={(e) => setFormData({...formData, website: e.target.value})}
          />
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-input"
            placeholder="e.g., info@yourbusiness.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        {/* Upload Image/Logo */}
        <div className="form-group">
          <label>Upload Image/Logo</label>
          <div className="upload-zone" style={{ cursor: 'pointer' }}>
            {formData.imagePreview ? (
              <div style={{ textAlign: 'center' }}>
                <img 
                  src={formData.imagePreview} 
                  alt="Business preview" 
                  style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
                />
                <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '8px' }}>
                  Click to change image
                </p>
              </div>
            ) : (
              <>
                <span className="icon">🖼️</span>
                <span className="text">Click to upload a logo or image</span>
                <span style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginTop: '4px' }}>
                  Supports JPG, PNG, GIF (Max 5MB)
                </span>
              </>
            )}
            <input 
              type="file" 
              accept="image/*" 
              style={{ display: 'none' }} 
              id="business-image-upload"
              onChange={handleImageChange}
            />
          </div>
        </div>

        <button type="submit" className="submit-btn" style={{ marginTop: '8px' }}>
          🏪 Add Business
        </button>
      </form>
    </div>
  );
}