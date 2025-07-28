import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import './settings.css';

export default function AdminSettings() {
  const [superadmins, setSuperadmins] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [updating, setUpdating] = useState({});
  const [formData, setFormData] = useState({
    superadmins: {},
    admins: {},
    divisions: {}
  });

  useEffect(() => {
    // Vérifier les permissions d'accès - Seuls les admins (secrétaires)
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || (user.role !== 'secretaire_sg' && user.role !== 'secretaire_ssg')) {
      setError('Accès non autorisé. Seuls les secrétaires peuvent accéder aux paramètres admin.');
      setLoading(false);
      return;
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setError(null);
      
      const [superRes, adminRes, divRes] = await Promise.all([
        api.getSuperadmins(),
        api.getAdmins(),
        api.getDivisions()
      ]);
      
      // Ensure we have arrays and handle potential errors
      const fetchedSuperadmins = Array.isArray(superRes) ? superRes : [];
      const fetchedAdmins = Array.isArray(adminRes) ? adminRes : [];
      const fetchedDivisions = Array.isArray(divRes) ? divRes : [];
      
      setSuperadmins(fetchedSuperadmins);
      setAdmins(fetchedAdmins);
      setDivisions(fetchedDivisions);
      
      // Initialize form data with current values including passwords
      const initialFormData = {
        superadmins: {},
        admins: {},
        divisions: {}
      };
      
      fetchedSuperadmins.forEach(sadmin => {
        initialFormData.superadmins[sadmin.superadmin_id] = {
          username: sadmin.username || '',
          password: sadmin.password || '', // Show actual password
          role: sadmin.role || ''
        };
      });
      
      fetchedAdmins.forEach(admin => {
        initialFormData.admins[admin.admin_id] = {
          username: admin.username || '',
          password: admin.password || '', // Show actual password
          role: admin.role || '',
          superadmin_id: admin.superadmin_id || ''
        };
      });
      
      fetchedDivisions.forEach(division => {
        initialFormData.divisions[division.division_id] = {
          division_nom: division.division_nom || '',
          division_responsable: division.division_responsable || '',
          password: division.password || '' // Show actual password
        };
      });
      
      setFormData(initialFormData);
    } catch (err) {
      console.error('Fetch data error:', err);
      setError(`Erreur lors du chargement des données: ${err.message}`);
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
    const currentData = type === 'superadmins' ? superadmins : 
                       type === 'admins' ? admins : divisions;
    
    const resetData = {};
    currentData.forEach(item => {
      const id = type === 'superadmins' ? item.superadmin_id :
                 type === 'admins' ? item.admin_id : item.division_id;
      
      if (type === 'superadmins') {
        resetData[id] = {
          username: item.username || '',
          password: item.password || '',
          role: item.role || ''
        };
      } else if (type === 'admins') {
        resetData[id] = {
          username: item.username || '',
          password: item.password || '',
          role: item.role || '',
          superadmin_id: item.superadmin_id || ''
        };
      } else {
        resetData[id] = {
          division_nom: item.division_nom || '',
          division_responsable: item.division_responsable || '',
          password: item.password || ''
        };
      }
    });
    
    setFormData(prev => ({
      ...prev,
      [type]: resetData
    }));
    
    setSuccess(`Données ${type} réinitialisées aux valeurs actuelles de la base de données`);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleUpdate = async (type, id) => {
    try {
      setError(null);
      setSuccess(null);
      setUpdating(prev => ({ ...prev, [`${type}-${id}`]: true }));
      
      const currentData = formData[type][id];
      if (!currentData) {
        throw new Error('Données non trouvées');
      }
      
      let updateData = {};
      
      // Prepare update data based on type
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
          
        case 'divisions':
          updateData = {
            division_nom: currentData.division_nom,
            division_responsable: currentData.division_responsable,
            password: currentData.password
          };
          break;
          
        default:
          throw new Error('Type de données non reconnu');
      }

      // Validate that required fields are not empty BEFORE API call
      const requiredFields = Object.keys(updateData);
      const emptyFields = requiredFields.filter(field => {
        return !updateData[field] || updateData[field].toString().trim() === '';
      });
      
      if (emptyFields.length > 0) {
        throw new Error(`Les champs suivants sont requis: ${emptyFields.join(', ')}`);
      }
      
      // Now make the API call
      let response;
      switch (type) {
        case 'superadmins':
          response = await api.updateSuperadmin(id, updateData);
          break;
        case 'admins':
          response = await api.updateAdmin(id, updateData);
          break;
        case 'divisions':
          response = await api.updateDivision(id, updateData);
          break;
        default:
          throw new Error('Type de données non reconnu');
      }
      
      // Update the local state immediately for real-time changes
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
      } else if (type === 'divisions') {
        setDivisions(prev => prev.map(item => 
          item.division_id === parseInt(id) 
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
        <h1>Paramètres Admin (Secrétaires)</h1>
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
      {/* Toast notification */}
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
          <div className="error" style={{ maxWidth: 400, margin: '0 auto', boxShadow: '0 2px 8px rgba(239,68,68,0.15)', pointerEvents: 'auto' }}>{error}</div>
        )}
      </div>
      
      {/* Superadmins Section */}
      <section className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Superadmins</h2>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom d'utilisateur</th>
                <th>Mot de passe</th>
                <th>Rôle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {superadmins.map(superadmin => {
                const currentData = formData.superadmins[superadmin.superadmin_id] || {};
                const isUpdating = updating[`superadmins-${superadmin.superadmin_id}`];
                return (
                  <tr key={superadmin.superadmin_id}>
                    <td>{superadmin.superadmin_id}</td>
                    <td>
                      <input
                        type="text"
                        value={currentData.username || ''}
                        onChange={(e) => handleChange('superadmins', superadmin.superadmin_id, 'username', e.target.value)}
                        placeholder="Nom d'utilisateur"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={currentData.password || ''}
                        onChange={(e) => handleChange('superadmins', superadmin.superadmin_id, 'password', e.target.value)}
                        placeholder="Mot de passe"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={currentData.role || ''}
                        onChange={(e) => handleChange('superadmins', superadmin.superadmin_id, 'role', e.target.value)}
                        placeholder="Rôle"
                      />
                    </td>
                    <td>
                      <button 
                        className="btn btn-update"
                        onClick={() => handleUpdate('superadmins', superadmin.superadmin_id)}
                        disabled={isUpdating}
                      >
                        {isUpdating ? 'Mise à jour...' : 'Mettre à jour'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Admins Section */}
      <section className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Admins</h2>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom d'utilisateur</th>
                <th>Mot de passe</th>
                <th>Rôle</th>
                <th>Superadmin ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(admin => {
                const currentData = formData.admins[admin.admin_id] || {};
                const isUpdating = updating[`admins-${admin.admin_id}`];
                return (
                  <tr key={admin.admin_id}>
                    <td>{admin.admin_id}</td>
                    <td>
                      <input
                        type="text"
                        value={currentData.username || ''}
                        onChange={(e) => handleChange('admins', admin.admin_id, 'username', e.target.value)}
                        placeholder="Nom d'utilisateur"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={currentData.password || ''}
                        onChange={(e) => handleChange('admins', admin.admin_id, 'password', e.target.value)}
                        placeholder="Mot de passe"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={currentData.role || ''}
                        onChange={(e) => handleChange('admins', admin.admin_id, 'role', e.target.value)}
                        placeholder="Rôle"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={currentData.superadmin_id || ''}
                        onChange={(e) => handleChange('admins', admin.admin_id, 'superadmin_id', e.target.value)}
                        placeholder="ID Superadmin"
                      />
                    </td>
                    <td>
                      <button 
                        className="btn btn-update"
                        onClick={() => handleUpdate('admins', admin.admin_id)}
                        disabled={isUpdating}
                      >
                        {isUpdating ? 'Mise à jour...' : 'Mettre à jour'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Divisions Section */}
      <section className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Responsables de Division</h2>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom de la Division</th>
                <th>Responsable</th>
                <th>Mot de passe</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {divisions.map(division => {
                const currentData = formData.divisions[division.division_id] || {};
                const isUpdating = updating[`divisions-${division.division_id}`];
                return (
                  <tr key={division.division_id}>
                    <td>{division.division_id}</td>
                    <td>
                      <input
                        type="text"
                        value={currentData.division_nom || ''}
                        onChange={(e) => handleChange('divisions', division.division_id, 'division_nom', e.target.value)}
                        placeholder="Nom de la division"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={currentData.division_responsable || ''}
                        onChange={(e) => handleChange('divisions', division.division_id, 'division_responsable', e.target.value)}
                        placeholder="Responsable"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={currentData.password || ''}
                        onChange={(e) => handleChange('divisions', division.division_id, 'password', e.target.value)}
                        placeholder="Mot de passe"
                      />
                    </td>
                    <td>
                      <button 
                        className="btn btn-update"
                        onClick={() => handleUpdate('divisions', division.division_id)}
                        disabled={isUpdating}
                      >
                        {isUpdating ? 'Mise à jour...' : 'Mettre à jour'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}