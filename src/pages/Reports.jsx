import React from 'react';
import ReportCard from '../components/reports/ReportCard';
import { mockReports } from '../data/mockData';

export default function Reports() {
  return (
    <div>
      <div className="dashboard-header">
        <h1>📄 All My Reports</h1>
        <p>{mockReports.length} reports submitted</p>
      </div>
      
      <div className="reports-list">
        {mockReports.map(report => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}