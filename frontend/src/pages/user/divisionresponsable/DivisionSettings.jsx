import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import '../admin/settings.css';

export default function DivisionSettings() {
  const [division, setDivision] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    division_nom: '',
    division_responsable: '',
    password: ''
  });

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Vérifier les permissions d'accès - Seuls les division responsables
    if (!user || user.role !== 'division_responsable') {
      setError('Accès non autorisé. Seuls les responsables de division peuvent accéder à cette page.');
      setLoading(false);
      return;
    }

    fetchDivisionData();
  }, []);

  const fetchDivisionData = async () => {
    try {
      setError(null);
      
      // Get all divisions and find the one matching the user's division_id
      const divisions = await api.getDivisions();
      const userDivision = divisions.find(div => div.division_id === parseInt(user.division_id));
      
      if (!userDivision) {
        throw new Error('Division non trouvée');
      }
      
      setDivision(userDivision);
      setFormData({
        division_nom: userDivision.division_nom || '',
        division_responsable: userDivision.division_responsable || '',
        password: userDivision.password || ''
      });
    } catch (err) {
      console.error('Fetch division data error:', err);
      setError(`Erreur lors du chargement des données: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetFormData = () => {
    if (division) {
      setFormData({
        division_nom: division.division_nom,
        division_responsable: division.division_responsable,
        password: division.password
      });
      setSuccess('Données réinitialisées aux valeurs actuelles');
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleUpdate = async () => {
    if (updating) return;
    
    try {
      setUpdating(true);
      setError(null);
      
      // Validate required fields
      const requiredFields = ['division_nom', 'division_responsable', 'password'];
      const emptyFields = requiredFields.filter(field => {
        return !formData[field] || formData[field].toString().trim() === '';
      });
      
      if (emptyFields.length > 0) {
        throw new Error(`Les champs suivants sont requis: ${emptyFields.join(', ')}`);
      }
      
      // Make API call
      const response = await api.updateDivision(user.division_id, formData);
      
      // Update local state immediately for real-time changes
      setDivision(prev => ({
        ...prev,
        ...formData
      }));
      
      setSuccess('✅ Division mise à jour avec succès!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Update error:', err);
      const errorMessage = err.message || 'Erreur inconnue';
      setError(`Échec de la mise à jour: ${errorMessage}`);
    } finally {
      setUpdating(false);
    }
  };

  // Toast auto-hide
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
    if (error) {
      const timer = setTimeout(() => setError(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  if (loading) {
    return (
      <div className="settings-container">
        <div className="loading" style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Chargement des données...</h2>
          <p>Veuillez patienter pendant que nous récupérons les informations.</p>
        </div>
      </div>
    );
  }

  if (error && !success) {
    return (
      <div className="settings-container">
        <div className="error" style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Erreur</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ 
              marginTop: '1rem', 
              padding: '0.5rem 1rem', 
              backgroundColor: '#4a6cf7', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer' 
            }}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Paramètres de Division</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={fetchDivisionData}
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: '#4a6cf7', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer' 
            }}
          >
            Actualiser les données
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      <div style={{ position: 'fixed', top: 20, left: 0, right: 0, zIndex: 9999, pointerEvents: 'none' }}>
        {success && (
          <div className="success" style={{ 
            maxWidth: 400, 
            margin: '0 auto', 
            padding: '12px 20px',
            backgroundColor: '#10b981',
            color: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(16,185,129,0.3)', 
            pointerEvents: 'auto',
            fontWeight: '600',
            textAlign: 'center',
            animation: 'fadeIn 0.3s ease-in'
          }}>
            {success}
          </div>
        )}
        {error && (
          <div className="error" style={{ 
            maxWidth: 400, 
            margin: '0 auto', 
            padding: '12px 20px',
            backgroundColor: '#ef4444',
            color: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(239,68,68,0.3)', 
            pointerEvents: 'auto',
            fontWeight: '600',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
      </div>

      {/* Division Information */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Informations de la Division</h2>
          <button 
            onClick={resetFormData}
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: '#6b7280', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer' 
            }}
          >
            Réinitialiser
          </button>
        </div>
        
        <div style={{ 
          padding: '2rem', 
          border: '1px solid #e5e7eb', 
          borderRadius: '8px', 
          backgroundColor: 'white',
          maxWidth: '800px'
        }}>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Nom de la Division
              </label>
              <input
                type="text"
                value={formData.division_nom}
                onChange={(e) => handleChange('division_nom', e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
                placeholder="Nom de la division"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Responsable de Division
              </label>
              <input
                type="text"
                value={formData.division_responsable}
                onChange={(e) => handleChange('division_responsable', e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
                placeholder="Nom du responsable"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Mot de passe
              </label>
              <input
                type="text"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
                placeholder="Mot de passe"
              />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button
                onClick={handleUpdate}
                disabled={updating}
                style={{ 
                  padding: '0.75rem 1.5rem', 
                  backgroundColor: updating ? '#9ca3af' : '#10b981', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: updating ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
              >
                {updating ? 'Mise à jour...' : 'Mettre à jour'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Division Statistics */}
      {division && (
        <section style={{ marginTop: '3rem' }}>
          <h2>Statistiques de la Division</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem', 
            marginTop: '1rem' 
          }}>
            <div style={{ 
              padding: '1.5rem', 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px', 
              backgroundColor: 'white',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#4a6cf7' }}>ID Division</h3>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
                {division.division_id}
              </p>
            </div>
            
            <div style={{ 
              padding: '1.5rem', 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px', 
              backgroundColor: 'white',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#10b981' }}>Date de création</h3>
              <p style={{ margin: 0, fontSize: '1rem' }}>
                {division.created_at ? new Date(division.created_at).toLocaleDateString('fr-FR') : 'N/A'}
              </p>
            </div>
            
            <div style={{ 
              padding: '1.5rem', 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px', 
              backgroundColor: 'white',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#f59e0b' }}>Dernière mise à jour</h3>
              <p style={{ margin: 0, fontSize: '1rem' }}>
                {division.updated_at ? new Date(division.updated_at).toLocaleDateString('fr-FR') : 'N/A'}
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
} 