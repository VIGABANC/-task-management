import React, { useState, useEffect, useRef } from 'react';
import './Agenda.css';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function getWeekRange(date) {
  const d = new Date(date);
  const dayOfWeek = d.getDay();
  const monday = new Date(d);
  monday.setDate(d.getDate() - ((dayOfWeek + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { monday, sunday };
}

export default function Agenda() {
  const [appointments, setAppointments] = useState([]);
  const { superadmin_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [selectedDateForExport, setSelectedDateForExport] = useState(null);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const exportDropdownRef = useRef(null);
  const monthNames = ["Janvier", "février", "Mars", "Avril", "Mai", "Juin", "Juillet", "août", "Septembre", "Octobre", "Novembre", "Decembre"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/rendezvous');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const filteredAppointments = data
          .filter(appointment => appointment.superadmin_id === parseInt(superadmin_id))
          .map(appointment => ({
            ...appointment,
            date: appointment.date
          }));
        setAppointments(filteredAppointments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [superadmin_id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target)) {
        setIsExportDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Group appointments by date
  const appointmentsByDate = {};
  appointments.forEach(appointment => {
    const dateStr = new Date(appointment.date).toISOString().split('T')[0];
    if (!appointmentsByDate[dateStr]) {
      appointmentsByDate[dateStr] = [];
    }
    appointmentsByDate[dateStr].push(appointment);
  });

  // Calendar navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Get days in month
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    for (let i = firstDay.getDay(); i > 0; i--) {
      const prevDate = new Date(year, month, -i + 1);
      days.push({ date: prevDate, isCurrentMonth: false, appointments: [] });
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      const dateStr = date.toISOString().split('T')[0];
      days.push({ date, isCurrentMonth: true, appointments: appointmentsByDate[dateStr] || [] });
    }
    const nextPadding = 42 - days.length;
    for (let i = 1; i <= nextPadding; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({ date: nextDate, isCurrentMonth: false, appointments: [] });
    }
    return days;
  };
  const days = getDaysInMonth();

  // Export logic
  const exportToPDF = (mode) => {
    const doc = new jsPDF();
    const userRole = superadmin_id === "1" ? "Gouverneur" : "Secrétaire Général";
    const referenceDate = selectedDateForExport || new Date();
    let title = '';
    let periodAppointments = [];
    let headers = superadmin_id === '2'
      ? ['Date', 'Objet de la réunion', 'Division', 'Heure', 'Siège']
      : ['Date', 'Objet de la réunion', 'Identification des participants', 'Heure', 'Observation'];
    if (mode === 'day') {
      const dateStr = referenceDate.toISOString().split('T')[0];
      periodAppointments = appointments.filter(a => a.date === dateStr);
      title = `Agenda (${userRole}) - ${referenceDate.toLocaleDateString('fr-FR')}`;
    } else if (mode === 'week') {
      const { monday, sunday } = getWeekRange(referenceDate);
      periodAppointments = appointments.filter(a => {
        const d = new Date(a.date);
        d.setHours(12);
        return d >= monday && d <= sunday;
      });
      title = `Agenda (${userRole}) - Semaine du ${monday.toLocaleDateString('fr-FR')} au ${sunday.toLocaleDateString('fr-FR')}`;
    } else if (mode === 'month') {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      periodAppointments = appointments.filter(a => {
        const d = new Date(a.date);
        return d.getFullYear() === year && d.getMonth() === month;
      });
      title = `Agenda (${userRole}) - ${monthNames[month]} ${year}`;
    }
    const data = periodAppointments.map(appt => [
      new Date(appt.date).toLocaleDateString('fr-FR'),
      appt.subject,
      appt.person || 'N/A',
      appt.time ? appt.time.substring(0, 5) : 'N/A',
      superadmin_id === '2' ? appt.location || 'N/A' : appt.notes || 'N/A'
    ]);
    doc.text(title, 14, 15);
    autoTable(doc, {
      head: [headers],
      body: data,
      startY: 20,
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [22, 160, 133], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });
    doc.save(`agenda_${userRole}_${mode}.pdf`);
    setIsExportDropdownOpen(false);
  };

  // Export dropdown labels
  const getDayExportLabel = () => `Jour (${(selectedDateForExport || new Date()).toLocaleDateString('fr-FR')})`;
  const getWeekExportLabel = () => {
    const { monday } = getWeekRange(selectedDateForExport || new Date());
    return `Semaine du ${monday.toLocaleDateString('fr-FR')}`;
  };

  if (loading) {
    return <div>Chargement des rendez-vous...</div>;
  }
  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <div className="agenda-container">
      <div className="agenda-containerfirstside">
        <div className="agenda-header">
          <h2>Agenda des Rendez-vous - {superadmin_id === "1" ? "Gouverneur" : "Secrétaire Général"}</h2>
          <div className="export-controls" ref={exportDropdownRef}>
            <div className="export-dropdown">
              <button className="export-button" onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}>
                Exporter PDF <span className={`dropdown-arrow ${isExportDropdownOpen ? 'open' : ''}`}>▼</span>
              </button>
              {isExportDropdownOpen && (
                <div className="export-dropdown-menu">
                  <button className="export-option" onClick={() => exportToPDF('day')}>
                    {getDayExportLabel()}
                  </button>
                  <button className="export-option" onClick={() => exportToPDF('week')}>
                    {getWeekExportLabel()}
                  </button>
                  <button className="export-option" onClick={() => exportToPDF('month')}>
                    Mois ({monthNames[currentDate.getMonth()]})
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="calendar-nav">
          <button onClick={prevMonth}>&lt;</button>
          <h3>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
          <button onClick={nextMonth}>&gt;</button>
        </div>
        <div className="calendar-grid">
          <div className="day-header">Dim</div>
          <div className="day-header">Lun</div>
          <div className="day-header">Mar</div>
          <div className="day-header">Mer</div>
          <div className="day-header">Jeu</div>
          <div className="day-header">Ven</div>
          <div className="day-header">Sam</div>
          {days.map((day, index) => (
            <div
              key={index}
              className={`calendar-day ${day.isCurrentMonth ? 'current-month' : 'other-month'} ${day.appointments.length > 0 ? 'has-appointments' : ''}`}
              onClick={() => {
                setSelectedAppointments(day.appointments);
                if (day.isCurrentMonth) setSelectedDateForExport(day.date);
              }}
            >
              <div className="day-number">{day.date.getDate()}</div>
              {day.appointments.length > 0 && (
                <div className="appointment-badge">{day.appointments.length}</div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="appointments-list">
        <h3>Rendez-vous pour le jour sélectionné</h3>
        {selectedAppointments.length === 0 ? (
          <p>Sélectionnez une date avec des rendez-vous</p>
        ) : (
          selectedAppointments.map(appointment => (
            <div key={appointment.id_rendezvous} className="appointment-card">
              <div className="appointment-time">
                {appointment.time.substring(0, 5)}
              </div>
              <div className="appointment-details">
                <strong>{appointment.subject}</strong>
                <p>Avec : {appointment.person}</p>
                <p>Notes : {appointment.notes}</p>
                <p>superadmin_id: {appointment.superadmin_id}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}