// API Configuration and utility functions
const API_BASE_URL = import.meta.env.PROD ? 'http://127.0.0.1:8000' : 'http://127.0.0.1:8000';

// Helper function to make API calls
export const apiCall = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    try {
        console.log('Appel API vers :', url, 'avec les options :', defaultOptions);
        const response = await fetch(url, defaultOptions);
        
        console.log('Statut de la réponse :', response.status);
        console.log('En-têtes de la réponse :', Object.fromEntries(response.headers.entries()));
        
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('Réponse non-JSON reçue :', text.substring(0, 200));
            throw new Error(`Réponse JSON attendue mais reçu ${contentType}. Réponse : ${text.substring(0, 100)}...`);
        }
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Erreur HTTP ! statut : ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error("Échec de l'appel API :", error);
        throw error;
    }
};

// Specific API functions
export const api = {
    // Rendezvous endpoints
    getRendezvous: () => apiCall('/api/v1/rendezvous'),
    createRendezvous: (data) => apiCall('/api/v1/rendezvous', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    
    // Division endpoints
    getDivisions: () => apiCall('/api/v1/divisions'),
    
    // Task endpoints
    getTasks: () => apiCall('/api/v1/tasks'),
    createTask: (data) => apiCall('/api/v1/tasks', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    
    // Auth endpoints
    login: (credentials) => apiCall('/api/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    }),
};

export default api; 