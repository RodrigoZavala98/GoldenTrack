import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AppProvider } from './context/AppContext.jsx'; // Importa el AppProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider> {/* Envuelve tu componente App */}
      <App />
    </AppProvider>
  </StrictMode>,
);