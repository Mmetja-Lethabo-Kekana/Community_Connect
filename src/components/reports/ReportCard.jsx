import React from 'react';

export default function ReportCard({ report }) {
  const getStatusClass = (status) => {
    switch(status) {
      case 'Resolved': return 'status-resolved';
      case 'In Progress': return 'status-in-progress';
      default: return 'status-submitted';
    }
  };

  return (
    <div className="report-card">
      <div className="report-card-header">
        <div>
          <div className="report-card-title">{report.title}</div>
          <div className="report-card-ref">🔑 Ref: {report.referenceNumber || 'N/A'}</div>
          <div className="report-card-location">📍 {report.location}</div>
          <div className="report-card-date">
            {report.date} · {report.time}
          </div>
        </div>
        <span className={`status-badge ${getStatusClass(report.status)}`}>
          {report.status}
        </span>
      </div>
    </div>
  );
}