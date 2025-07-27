import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as Iconsio5 from 'react-icons/io5';
import * as icontb from 'react-icons/tb';

import './App.css';
import './styles/Dachboard.css';
import './styles/taches.css';
import './styles/Division.css';
import './styles/DivisionManagement.css';
//ADMIN
import AdminDachboard from "./pages/user/admin/AdminDashboard";
import AddDivisionTask from "./pages/user/admin/Taches";
import AdminDivisions from "./pages/user/admin/Division";
import AdminSettings from "./pages/user/admin/Settings";
import AdminStatistics from "./pages/user/admin/Statistics";
import AdminHistory from "./pages/user/admin/historyadmin";
import AdminStatPerDivision from "./pages/user/admin/statisticepardivision";

import DivisionDashboard from "./pages/user/divisionresponsable/DashboardPage";
import DivisionHistory from "./pages/user/divisionresponsable/HistoryDivsion";
import DivisionTaskDetail from "./pages/user/divisionresponsable/TachesDetail";
import DivisionTaskManagement from "./pages/user/divisionresponsable/TaskManagement";
import photoprofile from './images/Screenshot 2025-04-10 141717.png';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import UserProfile from './pages/user/UserProfile';
import Dashboardsuperadmin from './pages/user/superadmin/Dashboardsuperadmin';
import Agenda from './pages/user/superadmin/agenda';
import Addagenda from './pages/user/admin/Addagenda';

export default function Maincontent({ user, setUser }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const handleTouchStart = useCallback((e) => {
    setTouchStart(e.touches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!touchStart) return;

    const currentTouch = e.touches[0].clientX;
    const diff = touchStart - currentTouch;

    if (diff > 50) {
      setIsSidebarOpen(false);
    } else if (diff < -50) {
      setIsSidebarOpen(true);
    }
  }, [touchStart]);

  const handleTouchEnd = useCallback(() => {
    setTouchStart(null);
  }, []);

  if (!user || !user.username) {
    return (
      <div>
        Non autorisé. Veuillez vous <a href="/">connecter</a>.
      </div>
    );
  }

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div 
      className={`app-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {isMobile && isSidebarOpen && (
        <div 
          className="mobile-backdrop active" 
          onClick={closeSidebar}
          role="presentation"
          aria-hidden="true"
        />
      )}
      
      <aside 
        className={`sidebar ${isSidebarOpen ? 'active' : ''}`}
        role="navigation"
        aria-label="Navigation principale"
      >
        <div className="logo">
          <div className="user-role">
            {user.username ? `${user.username}  `: 'Chargement...'}
          </div>
          {sidebarCollapsed ? (
            <icontb.TbLayoutSidebarLeftExpand
              size={35}
              fill="#DDDDDD"
              className="Sidebar"
              onClick={toggleSidebar}
              style={{ cursor: 'pointer' }}
              aria-label="Développer la barre latérale"
              role="button"
              tabIndex={0}
            />
          ) : (
            <icontb.TbLayoutSidebarLeftCollapse
              size={35}
              fill="#DDDDDD"
              className="Sidebar"
              onClick={toggleSidebar}
              style={{ cursor: 'pointer' }}
              aria-label="Réduire la barre latérale"
              role="button"
              tabIndex={0}
            />
          )}
        </div>

        <nav className="navigation">
          <ul className="menu-list">
            {(user.role === 'secretaire_sg' || user.role === 'secretaire_ssg')  && (
              <>
                <li className="menu-item">
                  <Link 
                    to="/app" 
                    className={`menu-link ${location.pathname === '/app' ? 'active' : ''}`}
                    onClick={closeSidebar}
                    aria-current={location.pathname === '/app' ? 'page' : undefined}
                  >
                    <Iconsio5.IoHome size={32} className="menu-icon" aria-hidden="true" />
                    <span className="menu-text">Tableau de bord</span>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link to="/app/Taches" className="menu-link" onClick={closeSidebar}>
                    <Iconsio5.IoList size={32} className="menu-icon" />
                    <span className="menu-text">Gestion des tâches</span>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link to="/app/Division" className="menu-link" onClick={closeSidebar}>
                    <Iconsio5.IoAnalytics size={32} className="menu-icon" />
                    <span className="menu-text">Gestion des divisions</span>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link to="/app/Statistics" className="menu-link" onClick={closeSidebar}>
                    <Iconsio5.IoStatsChart size={32} className="menu-icon" />
                    <span className="menu-text">Statistiques</span>
                  </Link>
                </li>
               
                <li className="menu-item">
                  <Link to={`/app/addagenda/${ user.role === 'secretaire_sg'?1:2 }`} className="menu-link" onClick={closeSidebar}>
                    <Iconsio5.IoBagAddOutline size={32} className="menu-icon" />
                    <span className="menu-text">Ajouter agenda</span>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link to="/app/Settings" className="menu-link" onClick={closeSidebar}>
                    <Iconsio5.IoSettings size={32} className="menu-icon" />
                    <span className="menu-text">Settings</span>
                  </Link>
                </li>
              </>
            )}
            {(user.role === 'governeur' || user.role === 'secretaire_general') &&(
              <>
              <li className="menu-item">
                  <Link 
                    to="/app" 
                    className={`menu-link ${location.pathname === '/app' ? 'active' : ''}`}
                    onClick={closeSidebar}
                    aria-current={location.pathname === '/app' ? 'page' : undefined}
                  >
                    <Iconsio5.IoHome size={32} className="menu-icon" aria-hidden="true" />
                    <span className="menu-text">Tableau de bord</span>
                  </Link>
                </li>
                
                <li className="menu-item">
                  <Link to="/app/Statistics" className="menu-link" onClick={closeSidebar}>
                    <Iconsio5.IoStatsChart size={32} className="menu-icon" />
                    <span className="menu-text">Statistiques</span>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link to={`/app/agenda/${ user.role === 'governeur'?'1':'2' }`} className="menu-link" onClick={closeSidebar}>
                    <Iconsio5.IoCalendar size={32} className="menu-icon" />
                    <span className="menu-text">Agenda</span>
                  </Link>
                </li>
               
              </>
            )}
            {user.role === 'division_responsable' && (
              <>
                <li className="menu-item">
                  <Link 
                    to="/app" 
                    className={`menu-link ${location.pathname === '/app' ? 'active' : ''}`}
                    onClick={closeSidebar}
                    aria-current={location.pathname === '/app' ? 'page' : undefined}
                  >
                    <Iconsio5.IoHome size={32} className="menu-icon" aria-hidden="true" />
                    <span className="menu-text">Tableau de bord</span>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link to="/app/Detail" className="menu-link" onClick={closeSidebar}>
                    <Iconsio5.IoList size={32} className="menu-icon" />
                    <span className="menu-text">Détail des tâches</span>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link to="/app/TaskManagement" className="menu-link" onClick={closeSidebar}>
                    <Iconsio5.IoAnalytics size={32} className="menu-icon" />
                    <span className="menu-text">Gestion des tâches</span>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link to="/app/Settings" className="menu-link" onClick={closeSidebar}>
                    <Iconsio5.IoSettings size={32} className="menu-icon" />
                    <span className="menu-text">Paramètres</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </aside>

      <header className="app-header">
        {isMobile && (
          <button 
            className="mobile-menu-btn" 
            onClick={toggleSidebar}
            aria-label="Basculer le menu"
            aria-expanded={isSidebarOpen}
            aria-controls="sidebar"
          >
            <Iconsio5.IoMenu size={24} aria-hidden="true" />
          </button>
        )}
        <div className="user-actions">
          <button 
            className="notification-btn"
            aria-label="Notifications"
          >
            <Iconsio5.IoNotificationsSharp size={22} aria-hidden="true" />
            <span className="notification-badge" aria-label="3 notifications non lues">3</span>
          </button>
          <div className="user-profile">
            <IconButton 
              onClick={handleProfileClick}
              aria-label="Menu utilisateur"
              aria-expanded={open}
              aria-haspopup="true"
            >
              <img 
                src={photoprofile} 
                alt={`Profil de ${user.username}`} 
                className="profile-image" 
              />
            </IconButton>
            <Menu
              id="profile-menu"
              style={{padding:"0%"}}
              anchorEl={anchorEl}
              open={open}
              onClose={handleCloseMenu}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              role="menu"
              aria-label="Menu utilisateur"
            >
              <Link to={`/app/Profile/${user.username}/${user.role}/${user.division_id}`}>
                <MenuItem onClick={handleCloseMenu} role="menuitem">
                  <span>Profil</span>
                </MenuItem>
              </Link>
              <MenuItem onClick={handleLogout} role="menuitem">Déconnexion</MenuItem>
            </Menu>
          </div>
        </div>
      </header>

      <main className="main-content" role="main">
        <Routes>
          <Route path="Profile/:user/:role/:division" element={<UserProfile />} />
          {(user.role === 'secretaire_sg' || user.role === 'secretaire_ssg')&& (
            <>
              <Route index element={<AdminDachboard />} />
              <Route path="Taches" element={<AddDivisionTask />} />
              <Route path="Division" element={<AdminDivisions />} />
              <Route path="Statistics" element={<AdminStatistics />} />
              <Route path="addagenda/:secretaire_id" element={<Addagenda />} />
              <Route path="HistoryAdmin/:idid_task" element={<AdminHistory />} />
              <Route path="stidivision/:iddiv" element={<AdminStatPerDivision />} />
              <Route path="Settings" element={<AdminSettings />} />
            </>
          )}
          {(user.role === 'governeur' || user.role === 'secretaire_general') && (
            <>
              <Route index element={<Dashboardsuperadmin />} />
              <Route path="Statistics" element={<AdminStatistics />} />
              <Route path="HistoryAdmin/:idid_task" element={<AdminHistory />} />
              <Route path="stidivision/:iddiv" element={<AdminStatPerDivision />} />
              <Route path="agenda/:superadmin_id" element={<Agenda />} />
            </>
          )}

          {user.role === 'division_responsable' && (
            <>
              <Route index element={<DivisionDashboard user={user} />} />
              <Route path="Detail" element={<DivisionTaskDetail user={user} />} />
              <Route path="history/:id_task" element={<DivisionHistory />} />
              <Route path="TaskManagement" element={<DivisionTaskManagement user={user}/>} />
              <Route path="Settings" element={<AdminSettings />} />
            </>
          )}
        </Routes>
      </main>
    </div>
  );
}

Maincontent.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    role: PropTypes.string,
    division_id: PropTypes.string
  }),
  setUser: PropTypes.func.isRequired
};

Maincontent.defaultProps = {
  user: null
};