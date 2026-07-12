import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { RefreshProvider } from './context/RefreshContext.tsx';
import ErrorBoundary from './components/ui/ErrorBoundary.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <RefreshProvider>
          <App />
        </RefreshProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
);
