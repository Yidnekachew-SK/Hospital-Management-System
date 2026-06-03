import React from 'react';
import AdminDashboard from "../adminPage/AdminDashboard.jsx";
import PatientPage from "../PatientPage/PatientPage.jsx";

export default function RoleRouter({ currentUser, onLogout }) {
  if (!currentUser) return null;

  // Reads the 'role' we added in Step 2 and Step 3
  const role = (currentUser.role || "").toLowerCase();

  switch (role) {
    case "admin":
      return <AdminDashboard onLogout={onLogout} />;
    default:
      return <PatientPage onLogout={onLogout} />;
  }
}