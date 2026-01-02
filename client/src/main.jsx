// src/main.jsx
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './config/queryClient';
import 'antd/dist/reset.css'; // Ant Design CSS
import './index.css';
import './styles/animations.css';
import App from './App.jsx';

// Note: StrictMode đã được tắt để tránh double rendering trong development
// Điều này ngăn multiple loading spinners xuất hiện cùng lúc
createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);