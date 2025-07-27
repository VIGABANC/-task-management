import React, { useState } from 'react';
// import "./stylesres/TaskManagment.css";
const TaskManagement = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Implémenter la connexion utilisateur',
      status: 'Todo',
      history: [
        {
          timestamp: '2025-04-17T09:00:00Z',
          change: 'Tâche créée',
          from: '',
          to: 'Todo',
          user: 'System'
        }
      ]
    }
  ]);

  const statusOptions = ['À faire', 'En cours', 'Revue', 'Terminé'];

  const handleStatusChange = (taskId, newStatus) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId) {
          const historyEntry = {
            timestamp: new Date().toISOString(),
            change: 'Statut modifié',
            from: task.status,
            to: newStatus,
            user: 'Utilisateur actuel' // Remplacer par l'utilisateur réel du contexte d'authentification
          };
          
          return {
            ...task,
            status: newStatus,
            history: [...task.history, historyEntry]
          };
        }
        return task;
      })
    );
  };

  return (
    <div className="task-management">
      <h2>Gestion des tâches</h2>
      <div className="task-grid">
        {tasks.map(task => (
          <div key={task.id} className="task-card-wrapper">
            <div className="task-card">
              <div className="card-body">
                <h5 className="card-title">{task.title}</h5>
                <div className="status-group">
                  <label>Statut:</label>
                  <select
                    className="status-select"
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  >
                    {statusOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div className="task-history">
                  <h6>Historique des modifications</h6>
                  <ul className="history-list">
                    {task.history.map((entry, index) => (
                      <li key={index} className="history-item">
                        <div className="history-meta">
                          <span className="history-date">
                            {new Date(entry.timestamp).toLocaleDateString()}
                          </span>
                          <span className="history-user">{entry.user}</span>
                        </div>
                        <div className="history-change">
                          {entry.change}: {entry.from && `${entry.from} → `}{entry.to}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskManagement;