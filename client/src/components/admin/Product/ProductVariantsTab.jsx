import React from 'react';
import { Button, Pagination } from 'antd';
import { EditOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Layers } from 'lucide-react';

const ProductVariantsTab = ({ 
  product, 
  totalStock, 
  paginatedVariants, 
  variantsPage, 
  variantsPerPage, 
  allVariants, 
  setVariantsPage, 
  navigate, 
  id 
}) => {
  const formatPrice = (price) => `${price?.toLocaleString('vi-VN')} ₫`;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="font-bold text-gray-900 text-base">{product.variants?.length || 0} biến thể</h3>
          <p className="text-sm text-gray-500 mt-0.5">Tổng tồn kho: {totalStock.toLocaleString()} · {product.variants?.filter(v => v.isActive !== false)?.length || 0} đang hoạt động</p>
        </div>
        <Button 
          onClick={() => navigate(`/admin-products/${id}/edit`)} 
          className="rounded-full h-8 px-4 text-blue-600 bg-blue-50 border-transparent font-semibold hover:bg-blue-100"
        >
          Quản lý biến thể
        </Button>
      </div>

      {product.variants?.length > 0 ? (
        <div className="border border-gray-100 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#f9fafb] border-b border-gray-100 uppercase text-[11px] font-bold text-gray-400 tracking-wider">
              <tr>
                <th className="px-6 py-4">Size</th>
                <th className="px-6 py-4">Màu sắc</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Giá bán</th>
                <th className="px-6 py-4">Tồn kho</th>
                <th className="px-6 py-4">Ngưỡng</th>
                <th className="px-6 py-4">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {paginatedVariants.map((v, i) => (
                <tr key={v.id || i} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-gray-900">{v.size || '—'}</td>
                  <td className="px-6 py-4">
                    {v.color ? (
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-4 h-4 rounded-full border border-gray-200" 
                          style={{ backgroundColor: v.color.startsWith('#') ? v.color : '#e5e7eb' }}
                        ></span>
                        <span>{v.color}</span>
                      </div>
                    ) : <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-500">{v.sku || 'N/A'}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{formatPrice(v.price)}</td>
                  <td className="px-6 py-4">
                    <StockIndicator stock={v.stock} threshold={v.lowStockThreshold || 5} />
                  </td>
                  <td className="px-6 py-4 text-gray-500">{v.lowStockThreshold || 5}</td>
                  <td className="px-6 py-4">
                    <StatusBadge active={v.isActive !== false} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {allVariants.length > variantsPerPage && (
            <div className="flex items-center justify-between border-t border-gray-100 p-4">
              <div className="text-sm text-gray-500">
                Hiển thị {(variantsPage - 1) * variantsPerPage + 1}-{Math.min(variantsPage * variantsPerPage, allVariants.length)} / {allVariants.length}
              </div>
              <Pagination
                current={variantsPage}
                pageSize={variantsPerPage}
                total={allVariants.length}
                onChange={setVariantsPage}
                size="small"
              />
            </div>
          )}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

const StockIndicator = ({ stock, threshold }) => {
  const isLow = stock < threshold;
  return (
    <div className="flex flex-col gap-1.5 w-24">
      <span className={`font-bold text-[13px] ${isLow ? 'text-red-500' : 'text-emerald-500'}`}>{stock}</span>
      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${isLow ? 'bg-red-500' : 'bg-emerald-400'}`} style={{ width: `${Math.min((stock / 100) * 100, 100)}%` }}></div>
      </div>
    </div>
  );
};

const StatusBadge = ({ active }) => (
  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${active ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-500'}`}>
    {active ? <><CheckCircleOutlined className="text-[10px]" /> Đang bán</> : 'Tạm ẩn'}
  </span>
);

const EmptyState = () => (
  <div className="text-center p-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
    <Layers size={32} className="mx-auto text-gray-300 mb-3" />
    <h4 className="text-sm font-bold text-gray-700 mb-1">Chưa có biến thể</h4>
    <p className="text-[13px] text-gray-500 max-w-sm mx-auto">Sản phẩm này hiện tại chưa có thiết lập biến thể màu sắc hoặc kích thước.</p>
  </div>
);

export default ProductVariantsTab;
