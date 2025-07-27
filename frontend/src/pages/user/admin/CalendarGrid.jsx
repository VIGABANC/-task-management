import React from 'react';

export default function CalendarGrid({ days, onDayClick, selectedDate }) {
  return (
    <div className="calendar-grid">
      {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map(day => (
        <div key={day} className="day-header">{day}</div>
      ))}
      {days.map((day, index) => {
        const isSelected = selectedDate && day.date.toDateString() === selectedDate.toDateString();
        const isToday = new Date().toDateString() === day.date.toDateString();
        return (
          <div
            key={index}
            className={`calendar-day \
              ${day.isCurrentMonth ? 'current-month' : 'other-month'} \
              ${day.appointments.length > 0 ? 'has-appointments' : ''} \
              ${isSelected ? 'selected' : ''} \
              ${isToday ? 'today' : ''}`}
            onClick={() => day.isCurrentMonth && onDayClick(day)}
          >
            <div className="day-number">{day.date.getDate()}</div>
            {day.appointments.length > 0 && (
              <div className="appointment-badge">{day.appointments.length}</div>
            )}
          </div>
        );
      })}
    </div>
  );
} 