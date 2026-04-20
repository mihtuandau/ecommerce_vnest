import React from 'react';
import { Button } from 'antd';
import { EditOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { ArrowLeft } from 'lucide-react';

const ProductHeader = ({ product, id, navigate }) => {
  return (
    <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/admin-products')} 
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg text-gray-600 transition-colors border border-transparent hover:border-gray-200"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-0.5">
            <span>#{product.id || id}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span>Sản phẩm</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">{product.name}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full border border-emerald-100 text-sm font-bold shadow-sm">
          <CheckCircleOutlined className="text-xs" />
          <span>Đang bán</span>
        </div>
        <Button 
          type="primary" 
          icon={<EditOutlined />} 
          onClick={() => navigate(`/admin-products/${id}/edit`)} 
          className="rounded-full h-9 font-bold px-5 shadow-md shadow-blue-500/20"
        >
          Chỉnh sửa
        </Button>
      </div>
    </div>
  );
};

export default ProductHeader;
