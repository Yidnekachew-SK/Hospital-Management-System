import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './login/loginPage.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
