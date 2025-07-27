import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './addagenda.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { api } from '../../../utils/api';

// NOUVEAU: Fonction utilitaire pour obtenir la plage de la semaine (Lundi à Dimanche)
const getWeekRange = (date) => {
    const d = new Date(date);
    const dayOfWeek = d.getDay();
    // Logic to find the preceding Monday
    const monday = new Date(d);
    monday.setDate(d.getDate() - ((dayOfWeek + 6) % 7));
    monday.setHours(0, 0, 0, 0);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    return { monday, sunday };
};

export default function Addagenda() {
    const { secretaire_id } = useParams();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedAppointments, setSelectedAppointments] = useState([]);
    const [isFormModalVisible, setIsFormModalVisible] = useState(false);
    const [selectedDateForForm, setSelectedDateForForm] = useState(null);
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        person: '',
        subject: '',
        notes: '',
        location: '',
        admin_id: secretaire_id,
        superadmin_id: secretaire_id === '1' ? 1 : 2,
    });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const exportDropdownRef = useRef(null);
    const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    const [divisions, setDivisions] = useState([]); // NOUVEAU: Divisions pour le menu déroulant
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.getRendezvous();
            const filtered = data
                .filter(a => a.superadmin_id === (secretaire_id === '1' ? 1 : 2))
                .map(a => ({ ...a, date: new Date(a.date).toISOString().split('T')[0] }));
            setAppointments(filtered);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [secretaire_id]);
    useEffect(() => { fetchData(); }, [fetchData]);
    useEffect(() => {
        if (secretaire_id === '2') {
            api.getDivisions()
                .then(data => setDivisions(data))
                .catch(() => setDivisions([]));
        }
    }, [secretaire_id]);
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
    const appointmentsByDate = appointments.reduce((acc, a) => {
        const dateStr = a.date;
        if (!acc[dateStr]) acc[dateStr] = [];
        acc[dateStr].push(a);
        return acc;
    }, {});
    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const getDaysInMonth = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
        const days = [];
        const prevLastDate = new Date(year, month, 0).getDate();
        for (let i = firstDayOfMonth; i > 0; i--) {
            const date = new Date(year, month - 1, prevLastDate - i + 1);
            days.push({ date, isCurrentMonth: false, appointments: [] });
        }
        for (let i = 1; i <= lastDateOfMonth; i++) {
            const date = new Date(year, month, i);
            const dateStr = date.toISOString().split('T')[0];
            days.push({ date, isCurrentMonth: true, appointments: appointmentsByDate[dateStr] || [] });
        }
        const remainingCells = 42 - days.length;
        for (let i = 1; i <= remainingCells; i++) {
            const date = new Date(year, month + 1, i);
            days.push({ date, isCurrentMonth: false, appointments: [] });
        }
        return days;
    };
    const days = getDaysInMonth();
    const handleDayClick = (day) => {
        setSelectedAppointments(day.appointments);
        const formattedDate = day.date.toISOString().split('T')[0];
        setSelectedDateForForm(day.date);
        setFormData({
            date: formattedDate,
            time: '',
            person: '',
            subject: '',
            notes: '',
            location: '',
            admin_id: secretaire_id,
            superadmin_id: secretaire_id === '1' ? 1 : 2,
        });
        setIsFormModalVisible(true);
    };
    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ text: '', type: '' });
        setValidationErrors({}); // Effacer les erreurs de validation précédentes
        try {
            const payload = { ...formData, time: formData.time ? `${formData.time}:00` : null };
            await api.createRendezvous(payload);
            setMessage({ text: 'Rendez-vous créé avec succès!', type: 'success' });
            setIsFormModalVisible(false);
            fetchData();
        } catch (error) {
            // Vérifier s'il s'agit d'une erreur de validation
            if (error.message.includes('422') || error.message.includes('validation')) {
                setValidationErrors({ notes: ['Le champ notes est requis.'] });
                setMessage({ text: 'Veuillez corriger les erreurs de validation.', type: 'error' });
            } else {
                setMessage({ text: `Erreur: ${error.message}`, type: 'error' });
            }
            console.error("Erreur de soumission:", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    const exportToPDF = (mode) => {
        const doc = new jsPDF();
        const userRole = secretaire_id === "1" ? "Gouverneur" : "Secrétaire Général";
        const referenceDate = selectedDateForForm || new Date();
        let title = '';
        let periodAppointments = [];
        let headers = secretaire_id === '2' 
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
            secretaire_id === '2' ? appt.location || 'N/A' : appt.notes || 'N/A'
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
    const getDayExportLabel = () => `Jour (${(selectedDateForForm || new Date()).toLocaleDateString('fr-FR')})`;
    const getWeekExportLabel = () => {
        const { monday, sunday } = getWeekRange(selectedDateForForm || new Date());
        return `Semaine du ${monday.toLocaleDateString('fr-FR')}`;
    };
    if (loading) return <div className="loading-state">Chargement de l'agenda...</div>;
    if (error) return <div className="error-state">Erreur: {error}</div>;
    return (
        <>
            <div className="add-agenda-container">
                <div className="agenda-header">
                    <h2>Agenda - {secretaire_id === "1" ? "Gouverneur" : "Secrétaire Général"}</h2>
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
                <div className="calendar-container">
                    <div className="calendar-nav">
                        <button onClick={prevMonth}>&lt;</button>
                        <h3>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
                        <button onClick={nextMonth}>&gt;</button>
                    </div>
                    <div className="calendar-grid">
                        {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map(day => <div key={day} className="day-header">{day}</div>)}
                        {days.map((day, index) => (
                            <div
                                key={index}
                                className={`calendar-day ${day.isCurrentMonth ? 'current-month' : 'other-month'}`}
                                onClick={() => day.isCurrentMonth && handleDayClick(day)}
                            >
                                <div className="day-number">{day.date.getDate()}</div>
                                {day.appointments.length > 0 && (
                                    <div className="appointment-badge">{day.appointments.length}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="appointments-list-container">
                     <h3>
                        {selectedDateForForm
                            ? `Rendez-vous du ${selectedDateForForm.toLocaleDateString('fr-FR')}`
                            : "Cliquez sur un jour pour voir les rendez-vous"
                        }
                    </h3>
                    <div className="appointments-list">
                        {selectedAppointments.length === 0 ? (
                            <p className="no-appointments-message">Aucun rendez-vous pour ce jour.</p>
                        ) : (
                            selectedAppointments.map(appointment => (
                                <div key={appointment.id_rendezvous} className="appointment-card">
                                    <div className="appointment-time">{appointment.time ? appointment.time.substring(0, 5) : 'N/A'}</div>
                                    <div className="appointment-details">
                                        <strong>{appointment.subject}</strong>
                                        <p><span>{secretaire_id === '1' ? 'Avec:' : 'Division:'}</span> {appointment.person}</p>
                                        <p><span>{secretaire_id === '1' ? 'Notes:' : 'Lieu:'}</span> {secretaire_id === '1' ? appointment.notes : appointment.location}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            {isFormModalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="modal-close-btn" onClick={() => setIsFormModalVisible(false)}>×</button>
                        <h3>Ajouter pour le {selectedDateForForm?.toLocaleDateString('fr-FR')}</h3>
                        <form onSubmit={handleSubmit} className="agenda-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Heure</label>
                                    <input type="time" name="time" value={formData.time} onChange={handleChange} required />
                                    {validationErrors.time && <div className="error-message">{validationErrors.time[0]}</div>}
                                </div>
                                <div className="form-group">
                                    <label>Objet de la réunion</label>
                                    <input type="text" name="subject" value={formData.subject} onChange={handleChange} required />
                                    {validationErrors.subject && <div className="error-message">{validationErrors.subject[0]}</div>}
                                </div>
                                {secretaire_id === '1' ? (
                                    <>
                                        <div className="form-group">
                                            <label>Identification des participants</label>
                                            <input type="text" name="person" value={formData.person} onChange={handleChange} required />
                                            {validationErrors.person && <div className="error-message">{validationErrors.person[0]}</div>}
                                        </div>
                                        <div className="form-group full-width">
                                            <label>Observation</label>
                                            <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" required />
                                            {validationErrors.notes && <div className="error-message">{validationErrors.notes[0]}</div>}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="form-group">
                                            <label>Division</label>
                                            <select
                                                name="person"
                                                value={formData.person}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Sélectionner une division</option>
                                                {divisions.map((div) => (
                                                    <option key={div.division_id} value={div.division_nom}>{div.division_nom}</option>
                                                ))}
                                            </select>
                                            {validationErrors.person && <div className="error-message">{validationErrors.person[0]}</div>}
                                        </div>
                                        <div className="form-group">
                                            <label>Siège</label>
                                            <input type="text" name="location" value={formData.location} onChange={handleChange} />
                                            {validationErrors.location && <div className="error-message">{validationErrors.location[0]}</div>}
                                        </div>
                                        <div className="form-group full-width">
                                            <label>Observation</label>
                                            <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" required />
                                            {validationErrors.notes && <div className="error-message">{validationErrors.notes[0]}</div>}
                                        </div>
                                    </>
                                )}
                            </div>
                            <button type="submit" className="submit-btn" disabled={isSubmitting}>
                                {isSubmitting ? 'Création...' : 'Créer Rendez-vous'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}