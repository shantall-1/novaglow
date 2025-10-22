import React from 'react'; // <-- Agrega esta línea
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { CarritoProvider } from './context/CarritoContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CarritoProvider>
      <App />
    </CarritoProvider>
  </React.StrictMode>
);