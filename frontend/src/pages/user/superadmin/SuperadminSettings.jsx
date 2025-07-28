import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import '../admin/settings.css';

export default function SuperadminSettings() {
  const [superadmins, setSuperadmins] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [updating, setUpdating] = useState({});
  const [formData, setFormData] = useState({
    superadmins: {},
    admins: {}
  });

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Vérifier les permissions d'accès - Seuls les superadmins
    if (!user || (user.role !== 'governeur' && user.role !== 'secretaire_general')) {
      setError('Accès non autorisé. Seuls les superadmins peuvent accéder aux paramètres système.');
      setLoading(false);
      return;
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setError(null);
      
      const [superRes, adminRes] = await Promise.all([
        api.getSuperadmins(),
        api.getAdmins()
      ]);
      
      const fetchedSuperadmins = Array.isArray(superRes) ? superRes : [];
      const fetchedAdmins = Array.isArray(adminRes) ? adminRes : [];
      
      setSuperadmins(fetchedSuperadmins);
      setAdmins(fetchedAdmins);
      
      // Initialize form data
      const initialFormData = {
        superadmins: {},
        admins: {}
      };
      
      fetchedSuperadmins.forEach(sadmin => {
        initialFormData.superadmins[sadmin.superadmin_id] = {
          username: sadmin.username || '',
          password: sadmin.password || '',
          role: sadmin.role || ''
        };
      });
      
      fetchedAdmins.forEach(admin => {
        initialFormData.admins[admin.admin_id] = {
          username: admin.username || '',
          password: admin.password || '',
          role: admin.role || '',
          superadmin_id: admin.superadmin_id || ''
        };
      });
      
      setFormData(initialFormData);
    } catch (err) {
      console.error('Fetch data error:', err);
      setError(`Erreur lors du chargement des données: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (type, id, field, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [id]: {
          ...prev[type][id],
          [field]: value
        }
      }
    }));
  };

  const resetFormData = (type) => {
    if (type === 'superadmins') {
      const resetData = {};
      superadmins.forEach(sadmin => {
        resetData[sadmin.superadmin_id] = {
          username: sadmin.username,
          password: sadmin.password,
          role: sadmin.role
        };
      });
      setFormData(prev => ({ ...prev, superadmins: resetData }));
    } else if (type === 'admins') {
      const resetData = {};
      admins.forEach(admin => {
        resetData[admin.admin_id] = {
          username: admin.username,
          password: admin.password,
          role: admin.role,
          superadmin_id: admin.superadmin_id
        };
      });
      setFormData(prev => ({ ...prev, admins: resetData }));
    }
    
    setSuccess(`Données ${type} réinitialisées aux valeurs actuelles de la base de données`);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleUpdate = async (type, id) => {
    if (updating[`${type}-${id}`]) return;
    
    try {
      setUpdating(prev => ({ ...prev, [`${type}-${id}`]: true }));
      setError(null);
      
      const currentData = formData[type][id];
      let updateData = {};
      
      switch (type) {
        case 'superadmins':
          updateData = {
            username: currentData.username,
            password: currentData.password,
            role: currentData.role
          };
          break;
        case 'admins':
          updateData = {
            username: currentData.username,
            password: currentData.password,
            role: currentData.role,
            superadmin_id: currentData.superadmin_id
          };
          break;
        default:
          throw new Error('Type de données non reconnu');
      }
      
      // Validate required fields
      const requiredFields = Object.keys(updateData);
      const emptyFields = requiredFields.filter(field => {
        return !updateData[field] || updateData[field].toString().trim() === '';
      });
      
      if (emptyFields.length > 0) {
        throw new Error(`Les champs suivants sont requis: ${emptyFields.join(', ')}`);
      }
      
      // Make API call
      let response;
      switch (type) {
        case 'superadmins':
          response = await api.updateSuperadmin(id, updateData);
          break;
        case 'admins':
          response = await api.updateAdmin(id, updateData);
          break;
        default:
          throw new Error('Type de données non reconnu');
      }
      
      // Update local state immediately for real-time changes
      if (type === 'superadmins') {
        setSuperadmins(prev => prev.map(item => 
          item.superadmin_id === parseInt(id) 
            ? { ...item, ...updateData }
            : item
        ));
      } else if (type === 'admins') {
        setAdmins(prev => prev.map(item => 
          item.admin_id === parseInt(id) 
            ? { ...item, ...updateData }
            : item
        ));
      }
      
      // Update form data to reflect changes
      setFormData(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          [id]: { ...prev[type][id], ...updateData }
        }
      }));
      
      setSuccess(`✅ ${type.slice(0, -1)} mis à jour avec succès!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Update error:', err);
      const errorMessage = err.message || 'Erreur inconnue';
      setError(`Échec de la mise à jour: ${errorMessage}`);
    } finally {
      setUpdating(prev => ({ ...prev, [`${type}-${id}`]: false }));
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
        <h1>Paramètres Superadmin</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={fetchData}
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

      {/* Superadmins Section */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Gestion des Superadmins</h2>
          <button 
            onClick={() => resetFormData('superadmins')}
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
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          {superadmins.map(sadmin => (
            <div key={sadmin.superadmin_id} style={{ 
              padding: '1.5rem', 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px', 
              backgroundColor: 'white' 
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'center' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Nom d'utilisateur</label>
                  <input
                    type="text"
                    value={formData.superadmins[sadmin.superadmin_id]?.username || ''}
                    onChange={(e) => handleChange('superadmins', sadmin.superadmin_id, 'username', e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '0.5rem', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '4px' 
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Mot de passe</label>
                  <input
                    type="text"
                    value={formData.superadmins[sadmin.superadmin_id]?.password || ''}
                    onChange={(e) => handleChange('superadmins', sadmin.superadmin_id, 'password', e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '0.5rem', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '4px' 
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Rôle</label>
                  <select
                    value={formData.superadmins[sadmin.superadmin_id]?.role || ''}
                    onChange={(e) => handleChange('superadmins', sadmin.superadmin_id, 'role', e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '0.5rem', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '4px' 
                    }}
                  >
                    <option value="">Sélectionner un rôle</option>
                    <option value="governeur">Gouverneur</option>
                    <option value="secretaire_general">Secrétaire Général</option>
                  </select>
                </div>
                
                <button
                  onClick={() => handleUpdate('superadmins', sadmin.superadmin_id)}
                  disabled={updating[`superadmins-${sadmin.superadmin_id}`]}
                  style={{ 
                    padding: '0.5rem 1rem', 
                    backgroundColor: updating[`superadmins-${sadmin.superadmin_id}`] ? '#9ca3af' : '#10b981', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px', 
                    cursor: updating[`superadmins-${sadmin.superadmin_id}`] ? 'not-allowed' : 'pointer' 
                  }}
                >
                  {updating[`superadmins-${sadmin.superadmin_id}`] ? 'Mise à jour...' : 'Mettre à jour'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Admins Section */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Gestion des Admins</h2>
          <button 
            onClick={() => resetFormData('admins')}
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
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          {admins.map(admin => (
            <div key={admin.admin_id} style={{ 
              padding: '1.5rem', 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px', 
              backgroundColor: 'white' 
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '1rem', alignItems: 'center' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Nom d'utilisateur</label>
                  <input
                    type="text"
                    value={formData.admins[admin.admin_id]?.username || ''}
                    onChange={(e) => handleChange('admins', admin.admin_id, 'username', e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '0.5rem', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '4px' 
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Mot de passe</label>
                  <input
                    type="text"
                    value={formData.admins[admin.admin_id]?.password || ''}
                    onChange={(e) => handleChange('admins', admin.admin_id, 'password', e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '0.5rem', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '4px' 
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Rôle</label>
                  <select
                    value={formData.admins[admin.admin_id]?.role || ''}
                    onChange={(e) => handleChange('admins', admin.admin_id, 'role', e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '0.5rem', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '4px' 
                    }}
                  >
                    <option value="">Sélectionner un rôle</option>
                    <option value="secretaire_sg">Secrétaire SG</option>
                    <option value="secretaire_ssg">Secrétaire SSG</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Superadmin ID</label>
                  <input
                    type="number"
                    value={formData.admins[admin.admin_id]?.superadmin_id || ''}
                    onChange={(e) => handleChange('admins', admin.admin_id, 'superadmin_id', e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '0.5rem', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '4px' 
                    }}
                  />
                </div>
                
                <button
                  onClick={() => handleUpdate('admins', admin.admin_id)}
                  disabled={updating[`admins-${admin.admin_id}`]}
                  style={{ 
                    padding: '0.5rem 1rem', 
                    backgroundColor: updating[`admins-${admin.admin_id}`] ? '#9ca3af' : '#10b981', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px', 
                    cursor: updating[`admins-${admin.admin_id}`] ? 'not-allowed' : 'pointer' 
                  }}
                >
                  {updating[`admins-${admin.admin_id}`] ? 'Mise à jour...' : 'Mettre à jour'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 