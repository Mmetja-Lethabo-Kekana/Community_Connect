// src/utils/businessStorage.js
import { mockBusinesses } from '../data/mockBusinesses';

// Business categories
export const businessCategories = [
  'Food & Restaurants',
  'Internet Cafes',
  'Shops',
  'Hair & Beauty',
  'Repairs',
  'Health',
  'Education',
  'Financial Services',
  'Other'
];

// Get all businesses (mock + user-added)
export function getAllBusinesses() {
  // Get stored businesses from localStorage
  const stored = localStorage.getItem('civicPulseBusinesses');
  let userBusinesses = [];
  if (stored) {
    try {
      userBusinesses = JSON.parse(stored);
    } catch (e) {
      userBusinesses = [];
    }
  }
  
  // Combine mock businesses with user businesses
  // Use a Set to avoid duplicates based on id
  const allBusinesses = [...mockBusinesses];
  userBusinesses.forEach(business => {
    if (!allBusinesses.find(b => b.id === business.id)) {
      allBusinesses.push(business);
    }
  });
  
  return allBusinesses;
}

// Save a new business
export function saveBusiness(business) {
  // Get existing user businesses only (not mock ones)
  const stored = localStorage.getItem('civicPulseBusinesses');
  let userBusinesses = [];
  if (stored) {
    try {
      userBusinesses = JSON.parse(stored);
    } catch (e) {
      userBusinesses = [];
    }
  }
  
  // Remove any existing business with same ID
  userBusinesses = userBusinesses.filter(b => b.id !== business.id);
  
  // Add new business
  userBusinesses.push(business);
  
  // Save back to localStorage
  localStorage.setItem('civicPulseBusinesses', JSON.stringify(userBusinesses));
  
  return business;
}

// Find businesses by category
export function getBusinessesByCategory(category) {
  const all = getAllBusinesses();
  if (category === 'All Categories') {
    return all;
  }
  return all.filter(b => b.category === category);
}

// Search businesses by name, category, or description
export function searchBusinesses(query) {
  const all = getAllBusinesses();
  if (!query || !query.trim()) return all;
  const lowerQuery = query.toLowerCase().trim();
  return all.filter(b => 
    b.name.toLowerCase().includes(lowerQuery) ||
    b.category.toLowerCase().includes(lowerQuery) ||
    b.description.toLowerCase().includes(lowerQuery) ||
    b.address.toLowerCase().includes(lowerQuery)
  );
}

// Get businesses near a location (simple filtering)
export function getNearbyBusinesses(lat, lng, radius = 5) {
  const all = getAllBusinesses();
  // For demo, we'll return all businesses with location data
  // In a real app, you'd calculate actual distances using Haversine formula
  return all.filter(b => b.latitude && b.longitude);
}

// Get business by ID
export function getBusinessById(id) {
  const all = getAllBusinesses();
  return all.find(b => b.id === id);
}

// Get top rated businesses
export function getTopRatedBusinesses(limit = 5) {
  const all = getAllBusinesses();
  return all
    .filter(b => b.rating !== undefined && b.rating !== null)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, limit);
}

// Get business count by category
export function getBusinessCountByCategory() {
  const all = getAllBusinesses();
  const counts = {};
  businessCategories.forEach(cat => {
    counts[cat] = all.filter(b => b.category === cat).length;
  });
  return counts;
}

// Get total business count
export function getTotalBusinessCount() {
  return getAllBusinesses().length;
}

// Delete a business (user-added only, not mock)
export function deleteBusiness(id) {
  // Get existing user businesses
  const stored = localStorage.getItem('civicPulseBusinesses');
  let userBusinesses = [];
  if (stored) {
    try {
      userBusinesses = JSON.parse(stored);
    } catch (e) {
      userBusinesses = [];
    }
  }
  
  // Filter out the business to delete
  userBusinesses = userBusinesses.filter(b => b.id !== id);
  
  // Save back to localStorage
  localStorage.setItem('civicPulseBusinesses', JSON.stringify(userBusinesses));
  
  return true;
}

// Update a business (user-added only)
export function updateBusiness(id, updatedData) {
  // Get existing user businesses
  const stored = localStorage.getItem('civicPulseBusinesses');
  let userBusinesses = [];
  if (stored) {
    try {
      userBusinesses = JSON.parse(stored);
    } catch (e) {
      userBusinesses = [];
    }
  }
  
  // Find and update the business
  const index = userBusinesses.findIndex(b => b.id === id);
  if (index !== -1) {
    userBusinesses[index] = { ...userBusinesses[index], ...updatedData };
    localStorage.setItem('civicPulseBusinesses', JSON.stringify(userBusinesses));
    return userBusinesses[index];
  }
  
  return null;
}

// Get businesses by rating range
export function getBusinessesByRating(minRating = 0, maxRating = 5) {
  const all = getAllBusinesses();
  return all.filter(b => 
    b.rating !== undefined && 
    b.rating !== null &&
    b.rating >= minRating && 
    b.rating <= maxRating
  );
}

// Get businesses with reviews
export function getBusinessesWithReviews() {
  const all = getAllBusinesses();
  return all.filter(b => b.reviews && b.reviews > 0);
}

// Get featured businesses (top rated with most reviews)
export function getFeaturedBusinesses(limit = 4) {
  const all = getAllBusinesses();
  return all
    .filter(b => b.rating && b.reviews && b.rating >= 4.0 && b.reviews > 50)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviews || 0) - (a.reviews || 0))
    .slice(0, limit);
}