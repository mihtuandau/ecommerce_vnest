// src/main.jsx
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';
import 'antd/dist/reset.css'; // Ant Design CSS
import './index.css';
import './styles/animations.css';
import App from './App.jsx';

// Note: StrictMode đã được tắt để tránh double rendering trong development
// Điều này ngăn multiple loading spinners xuất hiện cùng lúc
createRoot(document.getElementById('root')).render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#00a85a',
        colorLink: '#00a85a',
        colorLinkHover: '#008f4d',
      },
    }}
  >
    <App />
  </ConfigProvider>
);