import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter as Router} from 'react-router-dom'
import './index.css'
import { Toaster } from './components/ui/toaster.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Toaster/>
     <App />
    </Router>
  </StrictMode>,
)
