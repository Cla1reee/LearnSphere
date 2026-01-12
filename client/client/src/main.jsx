import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Router digeser ke sini agar AuthProvider bisa pakai useNavigate */}
    <App /> 
  </React.StrictMode>,
)