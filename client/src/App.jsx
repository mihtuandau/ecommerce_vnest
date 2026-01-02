// src/App.jsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AuthProvider } from './contexts/authContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { LoadingProvider } from './contexts/LoadingContext';
import { NotificationProvider } from './components/common/Notification';
import ErrorBoundary from './components/common/ErrorBoundary';
import CartSync from './components/common/CartSync';
import ChatWidget from './components/common/ChatWidget';
import store from './store/store';
import AppRoutes from './routes/AppRoutes';
import './index.css'; 

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider>
          <SettingsProvider>
            <LoadingProvider>
              <Router>
                <AuthProvider>
                  <NotificationProvider>
                    <CartSync />
                    <ChatWidget />
                    <AppRoutes />
                  </NotificationProvider>
                </AuthProvider>
              </Router>
            </LoadingProvider>
          </SettingsProvider>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;