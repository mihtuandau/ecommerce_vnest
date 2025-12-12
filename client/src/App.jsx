// src/App.jsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AuthProvider } from './contexts/authContext';
import { NotificationProvider } from './components/common/Notification';
import CartSync from './components/common/CartSync';
import ChatWidget from './components/common/ChatWidget';
import store from './store/store';
import AppRoutes from './routes/AppRoutes';
import './index.css'; 

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AuthProvider>
          <NotificationProvider>
            <CartSync />
            <ChatWidget />
            <AppRoutes />
          </NotificationProvider>
        </AuthProvider>
      </Router>
    </Provider>
  );
}

export default App;