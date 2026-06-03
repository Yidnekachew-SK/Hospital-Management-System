import axios from 'axios';

// Centralized configuration for backend connection
const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper to map UI names to exact backend paths from Postman JSON
export const getEndpoint = (tab) => {
  const endpoints = {
    'Employees': '/employees/',
    'UserAccounts': '/auth/user-accounts',
    'Departments': '/employees/departments',
    'Wards': '/clinic/wards',
    'Rooms': '/clinic/rooms',
    'Patients': '/patients/',
    'Insurance': '/patients/insurance',
    'Billing': '/finance/bills',
    'Logs': '/auth/system-logs'
  };
  return endpoints[tab] || null;
};

export default api;