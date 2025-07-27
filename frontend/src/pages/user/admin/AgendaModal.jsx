import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

export default function AgendaModal({ isOpen, onClose, selectedDate, secretaire_id, onFormSubmit }) {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if(selectedDate) {
      setFormData({
        date: selectedDate.toISOString().split('T')[0],
        time: '', person: '', subject: '', notes: '', location: '',
        admin_id: secretaire_id,
        superadmin_id: secretaire_id === '1' ? 1 : 2,
      });
    }
  }, [selectedDate, secretaire_id, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setValidationErrors({}); // Clear previous errors
    const payload = { ...formData, time: formData.time ? `${formData.time}:00` : null };
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/rendezvous', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 422 && errorData.errors) {
          // Handle validation errors
          setValidationErrors(errorData.errors);
          throw new Error('Veuillez corriger les erreurs de validation.');
        }
        throw new Error(errorData.message || 'La création a échoué.');
      }
      onFormSubmit({ type: 'success', message: 'Rendez-vous créé avec succès!' });
    } catch (error) {
      onFormSubmit({ type: 'error', message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}><FiX /></button>
        <h3>Ajouter un RDV - {selectedDate?.toLocaleDateString('fr-FR')}</h3>
        <form onSubmit={handleSubmit} className="agenda-form">
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
                <label>Participants</label>
                <input type="text" name="person" value={formData.person} onChange={handleChange} required />
                {validationErrors.person && <div className="error-message">{validationErrors.person[0]}</div>}
              </div>
              <div className="form-group">
                <label>Observation</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" required />
                {validationErrors.notes && <div className="error-message">{validationErrors.notes[0]}</div>}
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>Division</label>
                <input type="text" name="person" value={formData.person} onChange={handleChange} required />
                {validationErrors.person && <div className="error-message">{validationErrors.person[0]}</div>}
              </div>
              <div className="form-group">
                <label>Siège</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} />
                {validationErrors.location && <div className="error-message">{validationErrors.location[0]}</div>}
              </div>
              <div className="form-group">
                <label>Observation</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" required />
                {validationErrors.notes && <div className="error-message">{validationErrors.notes[0]}</div>}
              </div>
            </>
          )}
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Création...' : 'Créer le Rendez-vous'}
          </button>
        </form>
      </div>
    </div>
  );
} 