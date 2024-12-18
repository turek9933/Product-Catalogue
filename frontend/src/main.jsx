import React from 'react';
import ReactDOM from 'react-dom/client';

import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

import App from './App';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <I18nextProvider i18n={i18n}>
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <CartProvider>
          <React.StrictMode>
          <App />
            </React.StrictMode>
          </CartProvider>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  </I18nextProvider>
);
