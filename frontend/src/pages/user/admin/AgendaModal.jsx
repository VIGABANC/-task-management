import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { format, parseISO, isSameDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { api } from '../../../utils/api';
import { FiPlus, FiEdit2, FiTrash2, FiDownload, FiX, FiCalendar, FiFileText, FiSun, FiCalendar as FiCalendarWeek, FiCalendar as FiCalendarMonth, FiFile } from 'react-icons/fi';
import './addagenda.css';

// --- Helper Functions ---
const formatDate = (date) => format(date, 'yyyy-MM-dd');
const getFormattedTime = (time) => time.substring(0, 5);
const formatDisplayDate = (date) => format(new Date(date), 'EEEE dd MMMM yyyy', { locale: fr });

// --- Subcomponents ---

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
  </div>
);

// Export Buttons Component
const ExportButtons = ({ calendarRef, appointments, roleName }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = useCallback(async (type) => {
    if (isExporting) return; // Prevent multiple simultaneous exports
    
    try {
      setIsExporting(true);
      
      // Try dynamic import first
      let jsPDFClass, autoTable;
      
      try {
        const jsPDFModule = await import('jspdf');
        const autoTableModule = await import('jspdf-autotable');
        
        // Handle different module structures
        jsPDFClass = jsPDFModule.default || jsPDFModule;
        autoTable = autoTableModule.default || autoTableModule;
      } catch (importError) {
        console.error('Import error:', importError);
        throw new Error('Impossible de charger les modules PDF. Veuillez vérifier votre connexion internet.');
      }
      
      const doc = new jsPDFClass();
      const title = `Agenda - ${roleName()}`;
      let filteredAppointments = [...appointments];
      let subtitle = '';

      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        const viewType = calendarApi.view.type;
        const currentDate = calendarApi.getDate();

        if (type === 'day') {
          subtitle = `Jour: ${format(currentDate, 'dd MMMM yyyy', { locale: fr })}`;
          filteredAppointments = appointments.filter(app => 
            format(new Date(app.date), 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd')
          );
        } else if (type === 'week') {
          const start = startOfWeek(currentDate, { locale: fr });
          const end = endOfWeek(currentDate, { locale: fr });
          subtitle = `Semaine: ${format(start, 'dd MMM')} - ${format(end, 'dd MMM yyyy')}`;
          filteredAppointments = appointments.filter(app => 
            new Date(app.date) >= start && new Date(app.date) <= end
          );
        } else if (type === 'month') {
          const start = startOfMonth(currentDate);
          const end = endOfMonth(currentDate);
          subtitle = `Mois: ${format(currentDate, 'MMMM yyyy', { locale: fr })}`;
          filteredAppointments = appointments.filter(app => 
            new Date(app.date) >= start && new Date(app.date) <= end
          );
        }
      }

      doc.setFontSize(18);
      doc.text(title, 20, 15);
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(subtitle, 20, 23);
      
      const tableData = filteredAppointments.map(app => [
        format(new Date(app.date), 'dd/MM/yyyy', { locale: fr }),
        app.time.substring(0, 5),
        app.person,
        app.subject,
        app.location || '-'
      ]);
      
      autoTable(doc, {
        head: [['Date', 'Heure', 'Personne', 'Sujet', 'Lieu']],
        body: tableData,
        startY: 30,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [74, 108, 247] }
      });
      
      doc.save(`agenda_${type}_${format(new Date(), 'yyyyMMdd')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(`Erreur lors de la génération du PDF: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  }, [appointments, roleName, calendarRef, isExporting]);

    return (
    <div className="export-buttons">
      <button
        onClick={() => handleExport('day')}
        className="btn btn-export btn-day"
        title="Exporter le jour"
        disabled={isExporting}
      >
        <FiDownload />
        <span>{isExporting ? 'Génération...' : 'Jour'}</span>
      </button>
      <button
        onClick={() => handleExport('week')}
        className="btn btn-export btn-week"
        title="Exporter la semaine"
        disabled={isExporting}
      >
        <FiDownload />
        <span>{isExporting ? 'Génération...' : 'Semaine'}</span>
      </button>
      <button
        onClick={() => handleExport('month')}
        className="btn btn-export btn-month"
        title="Exporter le mois"
        disabled={isExporting}
      >
        <FiDownload />
        <span>{isExporting ? 'Génération...' : 'Mois'}</span>
      </button>
    </div>
  );
};

// Day View Component
const DayView = ({ date, appointments, onEdit, onDelete, onAdd, onClose, onGenerateReport }) => {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  
  const dayAppointments = appointments.filter(app => 
    isSameDay(new Date(app.date), date)
  );

  const handleGenerateReport = useCallback(async () => {
    if (isGeneratingReport) return;
    
    try {
      setIsGeneratingReport(true);
      
      // Try dynamic import first
      let jsPDFClass, autoTable;
      
      try {
        const jsPDFModule = await import('jspdf');
        const autoTableModule = await import('jspdf-autotable');
        
        // Handle different module structures
        jsPDFClass = jsPDFModule.default || jsPDFModule;
        autoTable = autoTableModule.default || autoTableModule;
      } catch (importError) {
        console.error('Import error:', importError);
        throw new Error('Impossible de charger les modules PDF. Veuillez vérifier votre connexion internet.');
      }
      
      const doc = new jsPDFClass();
      const title = `Rapport du jour`;
      const subtitle = formatDisplayDate(date);
      
      doc.setFontSize(18);
      doc.text(title, 20, 15);
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(subtitle, 20, 23);
      
      const tableData = dayAppointments.map(app => [
        getFormattedTime(app.time),
        app.person,
        app.subject,
        app.location || '-'
      ]);
      
      autoTable(doc, {
        head: [['Heure', 'Personne', 'Sujet', 'Lieu']],
        body: tableData,
        startY: 30,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [74, 108, 247] }
      });
      
      doc.save(`rapport_jour_${formatDate(date)}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(`Erreur lors de la génération du rapport: ${error.message}`);
    } finally {
      setIsGeneratingReport(false);
    }
  }, [dayAppointments, date, isGeneratingReport]);

  return (
    <div className="day-view-overlay" onClick={onClose}>
      <div className="day-view-content" onClick={(e) => e.stopPropagation()}>
        <div className="day-view-header">
          <h3>Rendez-vous du {formatDisplayDate(date)}</h3>
          <div className="day-view-actions">
            <button onClick={onAdd} className="btn btn-add">
              <FiPlus />
              <span>Ajouter</span>
            </button>
            <button onClick={handleGenerateReport} className="btn btn-report" disabled={isGeneratingReport}>
              <FiFileText />
              <span>{isGeneratingReport ? 'Génération...' : 'Générer rapport'}</span>
            </button>
            <button onClick={onClose} className="btn btn-close">
              <FiX />
            </button>
          </div>
        </div>
        
        <div className="day-view-body">
          {dayAppointments.length === 0 ? (
            <div className="no-appointments">
              <p>Aucun rendez-vous pour cette date</p>
            </div>
          ) : (
            <div className="appointments-list">
              {dayAppointments.map((appointment) => (
                <div key={appointment.id} className="appointment-item">
                  <div className="appointment-time">{getFormattedTime(appointment.time)}</div>
                  <div className="appointment-details">
                    <div className="appointment-person">{appointment.person}</div>
                    <div className="appointment-subject">{appointment.subject}</div>
                    {appointment.location && (
                      <div className="appointment-location">
                        <span className="location-icon">📍</span> {appointment.location}
                      </div>
                    )}
                  </div>
                  <div className="appointment-actions">
                    <button
                      onClick={() => onEdit(appointment)}
                      className="btn-icon btn-edit"
                      title="Modifier"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => onDelete(appointment.id)}
                      className="btn-icon btn-delete"
                      title="Supprimer"
                    >
                      <FiTrash2 />
    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Appointment Form Component
const AppointmentForm = ({ 
  formData, 
  setFormData, 
  onSubmit, 
  onCancel, 
  isEditing, 
  selectedDate 
}) => (
  <div className="modal-body">
    <div className="form-grid">
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Heure</label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({...formData, time: e.target.value})}
            required
          />
        </div>
        
        <div className="form-group full-width">
          <label>Personne</label>
          <input
            type="text"
            value={formData.person}
            onChange={(e) => setFormData({...formData, person: e.target.value})}
            required
          />
        </div>
        
        <div className="form-group full-width">
          <label>Sujet</label>
          <textarea
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
            required
            rows="3"
          />
        </div>
        
        <div className="form-group full-width">
          <label>Lieu</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
          />
        </div>
        
        <div className="form-group full-width">
          <label>Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            rows="3"
          />
        </div>
      </div>
  </div>
);

// Main AgendaModal Component
export default function AgendaModal() {
  const { secretaire_id } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDayView, setShowDayView] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const calendarRef = useRef(null);
  
  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = user?.role;
  
  const initialFormData = {
    date: formatDate(new Date()),
    time: '09:00',
    person: '',
    subject: '',
    notes: '',
    location: '',
    admin_id: secretaire_id,
    superadmin_id: secretaire_id === '1' ? '1' : '2'
  };
  
  const [formData, setFormData] = useState(initialFormData);

  const roleName = useCallback(() => {
    if (userRole === 'secretaire_sg') return 'Gouverneur';
    if (userRole === 'secretaire_ssg') return 'Secrétaire Général';
    return 'Utilisateur';
  }, [userRole]);

  // Fetch appointments
  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getRendezvous();
      const filteredAppointments = response.filter(
        appointment => appointment.admin_id === parseInt(secretaire_id)
      );
      setAppointments(filteredAppointments);
    } catch (err) {
      setError('Erreur lors du chargement des rendez-vous');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [secretaire_id]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      if (editingAppointment) {
        await api.updateRendezvous(editingAppointment.id, formData);
      } else {
        await api.createRendezvous(formData);
      }
      await fetchAppointments();
      closeModal();
    } catch (err) {
      setError('Erreur lors de la sauvegarde du rendez-vous');
      console.error(err);
    }
  }, [editingAppointment, formData, fetchAppointments]);

  // Handle appointment deletion
  const handleDelete = useCallback(async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
      try {
        await api.deleteRendezvous(id);
        await fetchAppointments();
      } catch (err) {
        setError('Erreur lors de la suppression');
        console.error(err);
      }
    }
  }, [fetchAppointments]);

  // Handle appointment editing
  const handleEdit = useCallback((appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      date: formatDate(parseISO(appointment.date)),
      time: getFormattedTime(appointment.time),
      person: appointment.person,
      subject: appointment.subject,
      notes: appointment.notes || '',
      location: appointment.location || '',
      admin_id: secretaire_id,
      superadmin_id: secretaire_id === '1' ? '1' : '2'
    });
    setShowModal(true);
  }, [secretaire_id]);

  // Close modal
  const closeModal = useCallback(() => {
    setShowModal(false);
    setEditingAppointment(null);
    setFormData(initialFormData);
  }, [initialFormData]);

  // Handle date selection (day click)
  const handleDateSelect = useCallback((selectInfo) => {
    const clickedDate = selectInfo.start;
    setSelectedDate(clickedDate);
    setShowDayView(true);
  }, []);

  // Handle event click
  const handleEventClick = useCallback((clickInfo) => {
    handleEdit(clickInfo.event.extendedProps.original);
  }, [handleEdit]);

  // Handle add new appointment from day view
  const handleAddFromDayView = useCallback(() => {
    setFormData({
      ...initialFormData,
      date: formatDate(selectedDate)
    });
    setShowDayView(false);
    setShowModal(true);
  }, [selectedDate, initialFormData]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="agenda-container">
      {/* Export Buttons */}
      <ExportButtons 
        calendarRef={calendarRef}
        appointments={appointments}
        roleName={roleName}
      />

      {/* FullCalendar */}
      <div className="calendar-wrapper">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth'
          }}
          locales={[frLocale]}
          locale="fr"
          height="auto"
          buttonText={{
            today: "Aujourd'hui",
            month: 'Mois',
            week: 'Semaine',
            day: 'Jour'
          }}
          events={appointments.map(app => ({
            id: app.id.toString(),
            title: `${app.time.substring(0, 5)} - ${app.person}`,
            start: new Date(`${app.date}T${app.time}`),
            extendedProps: {
              original: app
            },
            backgroundColor: userRole === 'secretaire_sg' ? '#4a6cf7' : '#10b981',
            borderColor: 'transparent'
          }))}
          selectable={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventContent={(arg) => (
            <div className="fc-event-main-frame">
              <div className="fc-event-time">{arg.timeText}</div>
              <div className="fc-event-title truncate">{arg.event.title.split(' - ')[1]}</div>
            </div>
          )}
        />
      </div>

      {/* Day View Modal */}
      {showDayView && selectedDate && (
        <DayView
          date={selectedDate}
          appointments={appointments}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAddFromDayView}
          onClose={() => setShowDayView(false)}
        />
      )}

      {/* Appointment Form Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div 
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>
                {editingAppointment ? 'Modifier un rendez-vous' : 'Ajouter un rendez-vous'}
              </h3>
              <button 
                onClick={closeModal}
                className="modal-close-btn"
              >
                <FiX />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <AppointmentForm 
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                onCancel={closeModal}
                isEditing={!!editingAppointment}
                selectedDate={selectedDate}
              />
              <div className="modal-footer">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="btn btn-cancel"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="btn btn-submit"
                >
                  {editingAppointment ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="error-toast">
          <span>{error}</span>
          <button onClick={() => setError(null)}>
            <FiX />
          </button>
        </div>
      )}
    </div>
  );
}