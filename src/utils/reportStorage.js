// src/utils/reportStorage.js
import { mockReports } from '../data/mockData';

// Get all reports (mock data + any new reports submitted)
export function getAllReports() {
  // Get stored reports from localStorage
  const storedReports = localStorage.getItem('civicPulseReports');
  console.log('Stored reports:', storedReports); // Debug log
  
  if (storedReports) {
    try {
      const parsed = JSON.parse(storedReports);
      console.log('Parsed stored reports:', parsed); // Debug log
      // Combine mock reports with stored reports
      const allReports = [...mockReports];
      parsed.forEach(report => {
        if (!allReports.find(r => r.id === report.id)) {
          allReports.push(report);
        }
      });
      console.log('All reports:', allReports); // Debug log
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
  console.log('Saving report:', report); // Debug log
  
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
  localStorage.setItem('civicPulseReports', JSON.stringify(reports));
  console.log('Reports saved:', reports); // Debug log
  
  return report;
}

// Find a report by reference number
export function findReportByReference(refNumber) {
  console.log('Searching for:', refNumber); // Debug log
  
  const allReports = getAllReports();
  console.log('All reports to search:', allReports); // Debug log
  
  const found = allReports.find(
    report => report.referenceNumber && 
    report.referenceNumber.toLowerCase() === refNumber.trim().toLowerCase()
  );
  
  console.log('Found:', found); // Debug log
  return found;
}

// Get reports for a specific user (by name)
export function getUserReports(userName) {
  const allReports = getAllReports();
  return allReports;
}