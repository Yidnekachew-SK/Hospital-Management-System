import React from "react";
import DoctorDashboard from "../doctorPage/DoctorPage.jsx";
import PatientDashboard from "../PatientPage/PatientPage.jsx";
import StaffDashboard from "../staffPage/StaffPage.jsx";
import NurseDashboard from "../dashboard/NurseDashboard.jsx";
import AdminDashboard from "../adminPage/AdminDashboard.jsx";
import ErrorPage from "../dashboard/error.jsx";


export default function RoleRouter({ currentUser, onLogout }) {
  if (!currentUser) return null;

  const role = currentUser.userRole?.toLowerCase();

  switch (role) {
    case "admin":
      return <AdminDashboard username={currentUser.username} onLogout={onLogout} />;
    case "doctor":
      return <DoctorDashboard username={currentUser.username} onLogout={onLogout} />;
    case "nurse":
      return <NurseDashboard username={currentUser.username} onLogout={onLogout} />;
    case "patient":
      return <PatientDashboard username={currentUser.username} onLogout={onLogout} />;
    case "staff":
      return <StaffDashboard username={currentUser.username} onLogout={onLogout} />;
    default:
      return (
        <ErrorPage 
          message="Authentication clearance error. Your user account does not possess a recognized administrative or clinical clearance role." 
          onLogout={onLogout} 
        />
      );
  }
}