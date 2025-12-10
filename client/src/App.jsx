// src/App.jsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/authContext';
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
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 2000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 3000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          <CartSync />
          <ChatWidget />
          <AppRoutes />
        </AuthProvider>
      </Router>
    </Provider>
  );
}

export default App;