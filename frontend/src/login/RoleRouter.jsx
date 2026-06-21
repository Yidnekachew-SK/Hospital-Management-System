import React from "react";
import DoctorDashboard from "../doctorPage/DoctorPage.jsx";
import PatientDashboard from "../PatientPage/PatientPage.jsx";
import StaffDashboard from "../staffPage/StaffPage.jsx";
import NurseDashboard from "../dashboard/NurseDashboard.jsx";
import AdminDashboard from "../dashboard/AdminDashboard.jsx";
import ErrorPage from "../dashboard/error.jsx"; // <-- Imported ErrorPage


export default function RoleRouter({ currentUser, onLogout }) {
  if (!currentUser) return null;

  const role = currentUser.userRole?.toLowerCase();

  switch (role) {
    case "admin":
      return <AdminDashboard onLogout={onLogout} />;
    case "doctor":
      return <DoctorPage username={username} onLogout={onLogout} />;
    case "nurse":
      return <NurseDashboard username={currentUser.username} onLogout={onLogout} />;
    case "patient":
      return <PatientDashboard username={currentUser.username} onLogout={onLogout} />;
    case "staff":
      return <StaffDashboard username={currentUser.username} onLogout={onLogout} />;
    default:
      // Render the ErrorPage when no authorized role is found
      return (
        <ErrorPage 
          message="Authentication clearance error. Your user account does not possess a recognized administrative or clinical clearance role." 
          onLogout={onLogout} 
        />
      );
  }
}