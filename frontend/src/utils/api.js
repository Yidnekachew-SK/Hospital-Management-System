import axios from 'axios';

const api = axios.create({
  // This ensures your Admin Dashboard looks at the Backend, not itself
  baseURL: 'http://localhosi/v1',
});

export const getEndpoint = (tab) => {
  const map = {
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
  return map[tab] || null;
};

export default api;