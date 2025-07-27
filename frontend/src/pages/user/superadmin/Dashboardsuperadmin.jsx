import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../../styles/AdminDashboard.css';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// Import required modules
import { Navigation, Pagination } from 'swiper/modules';

const apiUrl = 'http://127.0.0.1:8000/api/v1';

// Helper function to truncate text
const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export default function Dashboardsuperadmin() {
  
  const [activeTab, setActiveTab] = useState('en cours');
  const [tasksByStatus, setTasksByStatus] = useState({
    'terminé': [],
    'annulé': [],
    'en attente': [],
    'en cours': []
  });
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allTasks, setAllTasks] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [tasksRes, divisionsRes, statusesRes] = await Promise.all([
          axios.get(`${apiUrl}/tasks`),
          axios.get(`${apiUrl}/divisions`),
          axios.get(`${apiUrl}/statuses`)
        ]);

        const allTasks = tasksRes.data;
        const allStatuses = statusesRes.data;
        setDivisions(divisionsRes.data);

        const tasksWithLatestStatus = allTasks.map(task => {
          const taskStatuses = allStatuses
            .filter(s => s.task_id === task.task_id)
            .sort((a, b) => new Date(b.date_changed) - new Date(a.date_changed));

          const latestStatus = taskStatuses[0]?.statut || 'en attente';
          return { ...task, latestStatus };
        });

        const grouped = {
          'terminé': [],
          'annulé': [],
          'en attente': [],
          'en cours': []
        };

        tasksWithLatestStatus.forEach(task => {
          if (grouped[task.latestStatus]) {
            grouped[task.latestStatus].push(task);
                  } else {
          grouped['en attente'].push(task);
        }
        });

        setAllTasks(tasksWithLatestStatus);
        setTasksByStatus(grouped);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement du tableau de bord:', err);
        setError('Échec du chargement du tableau de bord');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const groupTasksByDate = (tasks) => {
    const grouped = {};
    
    tasks.forEach(task => {
      const date = task.due_date ? new Date(task.due_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : 'Aucune date d\'échéance';
      
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(task);
    });
    
    return grouped;
  };

  const getStatusTabClass = (status) => {
    switch (status) {
      case 'en cours':
        return 'status-tab active_tasks';
      case 'terminé':
        return 'status-tab completed_tasks';
      case 'annulé':
        return 'status-tab overdue_tasks';
      case 'en attente':
        return 'status-tab pending_tasks';
      default:
        return 'status-tab';
    }
  };

  const getStatusIndicatorClass = (status) => {
    switch (status) {
      case 'en cours':
        return 'status-indicator active';
      case 'terminé':
        return 'status-indicator terminé';
      case 'annulé':
        return 'status-indicator overdue';
      case 'en attente':
        return 'status-indicator en attente';
      default:
        return 'status-indicator';
    }
  };

  // Limit tasks to 3 per division
  const getLimitedTasks = (tasks, divisionId) => {
    return tasks
      .filter(task => task.division_id === divisionId)
      .slice(0, 3);
  };

  return (
    <div className="dashboard_container">
      <h1>Tableau de bord des tâches administrateur</h1>

      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading-indicator">Chargement...</div>
      ) : (
        <div className="dashboard-content">
          {/* Divisions Carousel */}
          <div className="divisions-carousel">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={15}
              slidesPerView={'auto'}
              centeredSlides={false}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              pagination={{ clickable: true }}
              breakpoints={{
                1200: { slidesPerView: 3 },
                992: { slidesPerView: 2 },
                576: { slidesPerView: 1 }
              }}
            >
              <div className="swiper-button-prev"></div>
              <div className="swiper-button-next"></div>
              {divisions.filter(division => 
                  allTasks.some(task => task.division_id === division.division_id)
                )
                .map(division => (
                  <SwiperSlide key={division.division_id}>
                    <Link to={`/app/stidivision/${division.division_id}`}>
                      <div className="divis_card">
                        <h2>{truncateText(division.division_nom, 20)}</h2>
                        <p>{truncateText(division.description || 'Aucune description disponible', 50)}</p>
                        <div className="list_taches">
                          {getLimitedTasks(allTasks, division.division_id).map(task => (
                            <div key={task.task_id} className="tache">
                              <span>{truncateText(task.task_name, 25)}</span>
                              <span className={`status-badge ${task.latestStatus.replace(/\s/g, '-').toLowerCase()}`}>
                                {task.latestStatus}
                              </span>         
                            </div>
                          ))}
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>

          {/* Tasks by Status Section */}
          <div className="list_of_tasks">
            <div className="title">Tâches par statut</div>
            
            <div className="Tasks_by_status">
              {['en cours', 'terminé', 'annulé', 'en attente'].map(status => (
                <div
                  key={status}
                  className={`${getStatusTabClass(status)} ${activeTab === status ? 'active' : ''}`}
                  onClick={() => setActiveTab(status)}
                >
                  <h2>
                    {status}
                    <span className="task-count">{tasksByStatus[status].length}</span>
                  </h2>
                </div>
              ))}
            </div>

            <div className="tasks-list-ui">
              {tasksByStatus[activeTab].length === 0 ? (
                <p>Aucune tâche avec le statut &quot;{activeTab}&quot;</p>
              ) : (
                <>
                  {Object.entries(groupTasksByDate(tasksByStatus[activeTab])).map(([date, tasks]) => (
                    <div key={date} className="task-group">
                      <h4 className="task-date">{date}</h4>
                      {tasks.slice(0, 5).map(task => {
                        const division = divisions.find(d => d.division_id === task.division_id);
                        return (
                          <div key={task.task_id} className="task-item">
                            <Link to={`/app/HistoryAdmin/${task.task_id}`}>
                              <div className="task-avatar" style={{ backgroundColor: '#4F46E5' }}>
                                {task.task_name.charAt(0).toUpperCase()}
                              </div>
                              <div className="task-details">
                                <strong>{truncateText(task.task_name, 30)}</strong>
                                <p>{truncateText(task.description || 'Aucune description', 50)}</p>
                                <small>
                                  {truncateText(division?.division_nom || 'Inconnu', 20)} • 
                                  {task.latestStatus}
                                </small>
                              </div>
                              <div className="task-status">
                                <span className={`status-badge ${task.latestStatus.replace(/\s/g, '-').toLowerCase()}`}>
                                  {task.latestStatus}
                                </span>
                              </div>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}