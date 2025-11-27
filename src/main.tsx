import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import './lib/i18n';
import { TestModeProvider } from './contexts/TestModeContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TestModeProvider>
      <App />
    </TestModeProvider>
  </React.StrictMode>
);

