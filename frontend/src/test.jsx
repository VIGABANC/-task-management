import  { useState } from 'react';
import axios from 'axios';
import './test.css'

const TaskForm = () => {
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [finDate, setFinDate] = useState('');
  const [divisionId, setDivisionId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/tasks/', {
        task_name: taskName,
        description:description,
        due_date: dueDate,
        fin_date: finDate,
        division_id: divisionId,
      });
      console.log('Tâche créée :', response.data);
    } catch (error) {
      console.error('Erreur lors de la création de la tâche :', error);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Créer une nouvelle tâche</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Nom de la tâche</label>
          <input
            type="text"
            className="form-input"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-input form-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="date-inputs">
          <div className="form-group">
            <label className="form-label">Date d'échéance</label>
            <input
              type="date"
              className="form-input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Date de fin</label>
            <input
              type="date"
              className="form-input"
              value={finDate}
              onChange={(e) => setFinDate(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">ID de la division</label>
          <input
            type="number"
            className="form-input"
            value={divisionId}
            onChange={(e) => setDivisionId(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Créer la tâche
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
