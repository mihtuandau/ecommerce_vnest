import React from 'react';
import { Form, Input } from 'antd';
import { Search } from 'lucide-react';

const { TextArea } = Input;

const StepProductSEO = ({ form, watchedName, watchedSlug, watchedMetaTitle, watchedMetaDesc }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex flex-shrink-0 items-center justify-center text-blue-500">
          <Search size={20} />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">SEO & Meta Tags</h3>
          <p className="text-xs text-gray-500">Tối ưu hóa sản phẩm cho công cụ tìm kiếm</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <Form.Item 
            name="metaTitle" 
            label={<div className="flex justify-between w-full"><span className="text-sm font-semibold text-gray-700">Meta Title</span></div>}
            className="mb-0"
          >
            <Input placeholder="Tiêu đề hiển thị trên Google..." size="large" maxLength={60} showCount className="rounded-lg h-12" />
          </Form.Item>
        </div>
        <div className="h-px bg-gray-100 w-full my-4"></div>
        <div>
          <Form.Item 
            name="metaDesc" 
            label={<div className="flex justify-between w-full"><span className="text-sm font-semibold text-gray-700">Meta Description</span></div>}
            className="mb-0"
          >
            <TextArea rows={3} placeholder="Mô tả ngắn hiển thị trên kết quả tìm kiếm Google..." maxLength={160} showCount className="rounded-lg p-3" />
          </Form.Item>
        </div>
        <div className="h-px bg-gray-100 w-full my-4"></div>

        <div>
          <div className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-3">XEM TRƯỚC KẾT QUẢ GOOGLE</div>
          <div className="border border-gray-200 rounded-xl p-5 bg-white max-w-2xl">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">G</div>
              <div>
                <div className="text-[12px] text-gray-800">yourshop.com</div>
              </div>
            </div>
            <div className="text-[18px] text-blue-700 font-medium hover:underline cursor-pointer truncate mb-0.5">
              {watchedMetaTitle || watchedName || 'Tiêu đề sản phẩm'}
            </div>
            <div className="text-[13px] text-emerald-700 font-medium truncate mb-1">
              https://yourshop.com/products/{watchedSlug || 'duong-dan-san-pham'}
            </div>
            <div className="text-[13px] text-gray-600 leading-snug line-clamp-2">
              {watchedMetaDesc || 'Mô tả sản phẩm sẽ hiển thị tại đây...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepProductSEO;
