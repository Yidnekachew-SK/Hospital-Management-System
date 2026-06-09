import React from 'react';
import NurseDashboard from "../nursePage/NurseDashboard.jsx";

export default function RoleRouter({ currentUser, onLogout }) {
  // For development on this branch, we bypass role checks
  // and load the Nurse module directly.
  return <NurseDashboard onLogout={onLogout} />;
}