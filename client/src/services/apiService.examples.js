/**
 * VÍ DỤ SỬ DỤNG API SERVICE VỚI CUSTOM HEADERS
 */

import apiService from './apiService';

// ===== GET Request với custom headers =====
export const exampleGet = async () => {
  const data = await apiService.get(
    '/products',
    { page: 1, limit: 10 },  // Query params
    { 'X-Custom-Header': 'custom-value' }  // Custom headers
  );
  return data;
};

// ===== POST Request với custom headers =====
export const examplePost = async () => {
  const data = await apiService.post(
    '/products',
    { name: 'New Product', price: 100 },  // Request body
    { 
      'X-Custom-Header': 'custom-value',
      'X-Request-ID': '12345'
    }  // Custom headers
  );
  return data;
};

// ===== Upload file với progress tracking =====
export const exampleUpload = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const data = await apiService.upload(
    '/upload',
    formData,
    { 'X-Upload-Type': 'product-image' },  // Custom headers
    (progress) => {}
  );
  return data;
};

// ===== Download file =====
export const exampleDownload = async () => {
  const response = await apiService.download(
    '/reports/export',
    { format: 'pdf' },  // Query params
    { 'X-Report-Type': 'sales' }  // Custom headers
  );
  
  // Tạo link download
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'report.pdf');
  document.body.appendChild(link);
  link.click();
  link.remove();
};

// ===== Sử dụng với authentication token riêng =====
export const exampleWithCustomAuth = async () => {
  const customToken = 'your-custom-token';
  
  const data = await apiService.get(
    '/admin/dashboard',
    {},
    { 
      'Authorization': `Bearer ${customToken}`,
      'X-Admin-Access': 'true'
    }
  );
  return data;
};

// ===== Gọi API với multiple custom headers =====
export const exampleMultipleHeaders = async () => {
  const headers = {
    'X-Request-ID': Date.now().toString(),
    'X-Client-Version': '1.0.0',
    'X-Device-Type': 'web',
    'X-User-Language': 'vi',
    'X-Timezone': 'Asia/Ho_Chi_Minh'
  };
  
  const data = await apiService.post(
    '/analytics/track',
    { event: 'page_view', page: '/home' },
    headers
  );
  return data;
};

// ===== PUT Request =====
export const examplePut = async (id, updateData) => {
  const data = await apiService.put(
    `/products/${id}`,
    updateData,
    { 'X-Update-Source': 'admin-panel' }
  );
  return data;
};

// ===== PATCH Request =====
export const examplePatch = async (id, partialData) => {
  const data = await apiService.patch(
    `/products/${id}`,
    partialData,
    { 'X-Partial-Update': 'true' }
  );
  return data;
};

// ===== DELETE Request =====
export const exampleDelete = async (id) => {
  const data = await apiService.delete(
    `/products/${id}`,
    { confirm: true },  // Request body
    { 'X-Delete-Reason': 'user-requested' }  // Custom headers
  );
  return data;
};

// ===== Sử dụng trong React Component =====
/*
import { useEffect, useState } from 'react';
import apiService from '../services/apiService';

function MyComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await apiService.get(
        '/products',
        { page: 1, limit: 10 },
        { 'X-Component': 'MyComponent' }
      );
      setData(result.products || []);
    } catch (error) {} finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? 'Loading...' : data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
*/
