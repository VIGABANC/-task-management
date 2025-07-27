import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HistoryAdmin.css';

export default function Historyadmin() {
    const { idid_task } = useParams();
    const navigate = useNavigate();
    const [historiques, setHistoriques] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [taskName, setTaskName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistoriques = async () => {
      try {
        setLoading(true);
        const [historiquesRes, taskRes] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/api/v1/historiques`),
          axios.get(`http://127.0.0.1:8000/api/v1/tasks/${idid_task}`)
        ]);
        
        const filteredData = historiquesRes.data.filter(item => item.task_id == idid_task);
        setHistoriques(filteredData);
        setTaskName(taskRes.data.task_name);
        
      } catch (error) {
        console.error('Erreur lors du chargement de l\'historique:', error);
        setError('Échec du chargement de l\'historique');
      } finally {
        setLoading(false);
      }
    };
    fetchHistoriques();
  }, [idid_task]);

  const handleRowClick = (histId) => {
    setSelectedId(selectedId === histId ? null : histId);
  };

  if (loading) return <div className="loading-indicator">Chargement...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="history-page">
      <h2>Historique de la tâche : {taskName || `Tâche n°${idid_task}`}</h2>
      <p style={{ color: 'var(--text-light)', marginBottom: '24px' }}>
        Cliquez sur une entrée d'historique pour voir les détails complets et les documents joints.
      </p>
      
      <table className="history-table">
        <thead>
          <tr>
            <th>Aperçu de la description</th>
            <th>Date de modification</th>
          </tr>
        </thead>
        <tbody>
          {historiques.length === 0 ? (
            <tr>
              <td colSpan="2" style={{ textAlign: 'center', padding: '32px' }}>
                Aucune entrée d'historique trouvée pour cette tâche.
              </td>
            </tr>
          ) : (
            historiques.slice().reverse().map((hist) => (
              <React.Fragment key={hist.hist_id}>
                <tr
                  className={`history-row ${selectedId === hist.hist_id ? 'selected' : ''}`}
                  onClick={() => handleRowClick(hist.hist_id)}
                >
                  <td>{hist.description.substring(0, 50)}...</td>
                  <td>{new Date(hist.change_date).toLocaleString()}</td>
                </tr>
                
                {selectedId === hist.hist_id && (
                  <tr className="expanded-row">
                    <td colSpan="2">
                      <div className="history-details">
                        <div className="detail-section">
                          <h4>Description complète :</h4>
                          <p>{hist.description}</p>
                        </div>
                        <div className="detail-section">
                          <h4>Document joint :</h4>
                          {hist.dochistorique_path ? (
                            <a
                              href={`http://localhost:8000/storage/${hist.dochistorique_path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="document-link"
                            >
                              📄 Voir le document
                            </a>
                          ) : (
                            <p>Aucun document joint</p>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
      
      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <button 
          onClick={() => navigate('/app')}
          style={{
            padding: '12px 24px',
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = 'var(--primary-hover)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'var(--primary)'}
        >
          ← Retour au tableau de bord
        </button>
      </div>
    </div>
  );
}
