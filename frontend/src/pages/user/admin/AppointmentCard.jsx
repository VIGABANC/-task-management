import React from 'react';

export default function AppointmentCard({ appt }) {
  return (
    <div className="appointment-card">
      <div className="appointment-time">{appt.time?.substring(0, 5)}</div>
      <div className="appointment-details">
        <strong>{appt.subject}</strong>
        <p>{appt.person}</p>
      </div>
    </div>
  );
} 