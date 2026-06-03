import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000/api/v1',
});

// Automatically attaches the JWT Token from storage to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Strict mapping to the paths provided in your friend's Postman JSON
export const getEndpoint = (tab) => {
  const map = {
    'Employees': '/employees/',
    'UserAccounts': '/auth/user-accounts',
    'Departments': '/employees/departments',
    'Wards': '/clinic/wards',
    'Rooms': '/clinic/rooms',
    'Patients': '/patients/',
    'Insurance': '/patients/insurance', // Postman says singular
    'Billing': '/finance/bills',
    'Logs': '/auth/system-logs',      // Matches Postman JSON
    'ActivityLog': '/auth/activity-logs'
  };
  return map[tab] || null;
};

export default api;