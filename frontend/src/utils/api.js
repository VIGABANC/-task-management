import axios from 'axios';

// API Configuration and utility functions
const API_BASE_URL = import.meta.env.PROD ? 'http://127.0.0.1:8000' : 'http://127.0.0.1:8000';

// Create axios instance with default configuration
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
});

// Add request interceptor for logging
axiosInstance.interceptors.request.use(
    (config) => {
        if (import.meta.env.DEV && config.method && config.method !== 'get') {
            console.log(`API ${config.method.toUpperCase()} call to: ${config.url}`);
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
    (response) => {
        if (import.meta.env.DEV && response.config.method && response.config.method !== 'get') {
            console.log(`API ${response.config.method.toUpperCase()} response:`, response.data);
        }
        return response;
    },
    (error) => {
        console.error('Response error:', error);
        if (error.response) {
            // Server responded with error status
            const errorMessage = error.response.data?.message || `HTTP error! status: ${error.response.status}`;
            throw new Error(errorMessage);
        } else if (error.request) {
            // Request was made but no response received
            throw new Error('No response received from server');
        } else {
            // Something else happened
            throw new Error(error.message || 'Network error');
        }
    }
);

// Specific API functions
export const api = {
    // Rendezvous endpoints
    getRendezvous: () => axiosInstance.get('/api/v1/rendezvous').then(response => response.data),
    createRendezvous: (data) => axiosInstance.post('/api/v1/rendezvous', data).then(response => response.data),
    updateRendezvous: (id, data) => axiosInstance.put(`/api/v1/rendezvous/${id}`, data).then(response => response.data),
    deleteRendezvous: (id) => axiosInstance.delete(`/api/v1/rendezvous/${id}`).then(response => response.data),
    
    // Superadmin endpoints
    getSuperadmins: () => axiosInstance.get('/api/v1/superadmins').then(response => response.data),
    createSuperadmin: (data) => axiosInstance.post('/api/v1/superadmins', data).then(response => response.data),
    updateSuperadmin: (id, data) => axiosInstance.put(`/api/v1/superadmins/${id}`, data).then(response => response.data),
    deleteSuperadmin: (id) => axiosInstance.delete(`/api/v1/superadmins/${id}`).then(response => response.data),
    
    // Admin endpoints
    getAdmins: () => axiosInstance.get('/api/v1/admins').then(response => response.data),
    createAdmin: (data) => axiosInstance.post('/api/v1/admins', data).then(response => response.data),
    updateAdmin: (id, data) => axiosInstance.put(`/api/v1/admins/${id}`, data).then(response => response.data),
    deleteAdmin: (id) => axiosInstance.delete(`/api/v1/admins/${id}`).then(response => response.data),
    
    // Division endpoints
    getDivisions: () => axiosInstance.get('/api/v1/divisions').then(response => response.data),
    createDivision: (data) => axiosInstance.post('/api/v1/divisions', data).then(response => response.data),
    updateDivision: (id, data) => axiosInstance.put(`/api/v1/divisions/${id}`, data).then(response => response.data),
    deleteDivision: (id) => axiosInstance.delete(`/api/v1/divisions/${id}`).then(response => response.data),
    
    // Task endpoints
    getTasks: () => axiosInstance.get('/api/v1/tasks').then(response => response.data),
    createTask: (data) => axiosInstance.post('/api/v1/tasks', data).then(response => response.data),
    
    // Auth endpoints
    login: (credentials) => axiosInstance.post('/api/login', credentials).then(response => response.data),
};

export default api; 