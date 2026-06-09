import React from 'react';
import NurseDashboard from './nursePage/NurseDashboard.jsx';

function App() {
  return <NurseDashboard onLogout={() => console.log('Logout Clicked')} />;
}

export default App;