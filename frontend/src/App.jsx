import React, { useState } from 'react';
import LoginPage from './login/loginPage'; 
import RoleRouter from './login/RoleRouter';

function App() {
  // This state stores the 'user' object once they log in
  const [user, setUser] = useState(null);

  // If the 'user' state is empty, stay on the Login Page
  if (!user) {
    return <LoginPage onLoginSuccess={(userData) => setUser(userData)} />;
  }

  // Delegate all routing to RoleRouter
  return <RoleRouter currentUser={user} onLogout={() => setUser(null)} />;
}

export default App;