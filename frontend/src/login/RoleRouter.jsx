import React from "react";
import DoctorDashboard from "../doctorPage/DoctorPage.jsx";
import PatientDashboard from "../dashboard/PatientDashboard.jsx";
import NurseDashboard from "../dashboard/NurseDashboard.jsx";
import AdminDashboard from "../dashboard/AdminDashboard.jsx";

/**
 * RoleRouter component inspects the current user's authenticated role 
 * and guides them to their corresponding dashboard page. 
 */
export default function RoleRouter({ currentUser, onLogout }) {
  if (!currentUser) return null;

  switch (currentUser.userRole?.toLowerCase()) {
    case "admin":
      return <AdminDashboard username={currentUser.username} onLogout={onLogout} />;
    case "doctor":
      return <DoctorDashboard username={currentUser.username} onLogout={onLogout} />;
    case "nurse":
      return <NurseDashboard username={currentUser.username} onLogout={onLogout} />;
    case "patient":
      return <PatientDashboard username={currentUser.username} onLogout={onLogout} />;
    default:
      // Fallback workspace
      return <PatientDashboard username={currentUser.username} onLogout={onLogout} />;
  }
}
