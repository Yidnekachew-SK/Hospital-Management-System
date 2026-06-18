import React from 'react';
import AdminDashboard from "../adminPage/AdminDashboard.jsx";
import PatientPage from "../PatientPage/PatientPage.jsx";
import DoctorPage from "../doctorPage/DoctorPage.jsx";
import NurseDashboard from "../nursePage/NurseDashboard.jsx";

export default function RoleRouter({ currentUser, onLogout }) {
  if (!currentUser) return null;

  // Reads the 'role' we added in Step 2 and Step 3
  const role = (currentUser.role || "").toLowerCase();
  const username = currentUser.username || "";

  switch (role) {
    case "admin":
      return <AdminDashboard onLogout={onLogout} />;
    case "doctor":
      return <DoctorPage username={username} onLogout={onLogout} />;
    case "nurse":
      return <NurseDashboard username={username} userRole={role} onLogout={onLogout} />;
    default:
      return <PatientPage onLogout={onLogout} />;
  }
}