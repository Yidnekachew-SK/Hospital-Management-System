import React, { useState } from 'react';
import LoginPage from './login/loginPage'; 
import AdminDashboard from './pages/AdminDashboard';
import PatientPage from './PatientPage/PatientPage';

function App() {
  // This state stores the 'user' object once they log in
  const [user, setUser] = useState(null);

  // If the 'user' state is empty, stay on the Login Page
  if (!user) {
    return <LoginPage onLoginSuccess={(userData) => setUser(userData)} />;
  }

  // If the user has a role of 'admin', show YOUR dashboard
  if (user.role === 'admin') {
    return <AdminDashboard />;
  }

  // For any other role, show the Patient Page
  return <PatientPage />;
}

export default App;