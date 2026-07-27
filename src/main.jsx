import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// El service worker se registra aquí y no en index.html porque Vite solo
// reescribe la ruta base en los atributos del HTML, no dentro de los scripts:
// '/sw.js' apuntaba a la raíz del dominio y daba 404, así que nunca quedaba
// registrado y Chrome no ofrecía instalar la app.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`, { scope: import.meta.env.BASE_URL })
      .catch(err => console.warn('SW registration failed:', err))
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
