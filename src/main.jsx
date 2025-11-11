import { StrictMode } from 'react'
import { AuthProvider } from './context/AuthContext'
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { CarritoProvider } from './context/CarritoContext';

ReactDOM.createRoot(document.getElementById('root')).render(
    <StrictMode>
      <AuthProvider>
        <CarritoProvider>
          <App />
        </CarritoProvider>
      </AuthProvider>
    </StrictMode>
);