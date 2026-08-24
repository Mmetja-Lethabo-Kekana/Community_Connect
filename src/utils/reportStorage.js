// src/utils/reportStorage.js
import { mockReports } from '../data/mockData';

// Get all reports (mock data + any new reports submitted)
export function getAllReports() {
  // Get stored reports from localStorage
  const storedReports = localStorage.getItem('CommunityConnectReports');
  if (storedReports) {
    try {
      const parsed = JSON.parse(storedReports);
      // Combine mock reports with stored reports
      // Use a Set to avoid duplicates based on id
      const allReports = [...mockReports];
      parsed.forEach(report => {
        if (!allReports.find(r => r.id === report.id)) {
          allReports.push(report);
        }
      });
      return allReports;
    } catch (e) {
      console.warn('Error parsing stored reports:', e);
      return mockReports;
    }
  }
  return mockReports;
}

// Save a new report
export function saveReport(report) {
  // Get existing stored reports
  const storedReports = localStorage.getItem('civicPulseReports');
  let reports = [];
  if (storedReports) {
    try {
      reports = JSON.parse(storedReports);
    } catch (e) {
      reports = [];
    }
  }
  
  // Add new report
  reports.push(report);
  
  // Save back to localStorage
  localStorage.setItem('CommunityConnectReports', JSON.stringify(reports));
  
  return report;
}

// Find a report by reference number
export function findReportByReference(refNumber) {
  const allReports = getAllReports();
  return allReports.find(
    report => report.referenceNumber && 
    report.referenceNumber.toLowerCase() === refNumber.trim().toLowerCase()
  );
}

// Get reports for a specific user (by name)
export function getUserReports(userName) {
  const allReports = getAllReports();
  // In a real app, you'd filter by user ID
  // For now, we'll return all reports
  return allReports;
}