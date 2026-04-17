import React from 'react';
import { Trash2 } from 'lucide-react';

const StepProductImages = ({ productImages, handleProductImageSelect, removeProductImage }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 lg:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 border-l-4 border-pink-500 pl-3">Tải lên hình ảnh</h3>
        <div className="bg-pink-50 text-pink-600 px-3 py-1 rounded-full text-xs font-semibold uppercase">
          Tối đa 10 ảnh
        </div>
      </div>
      
      <div className="cursor-pointer rounded-xl border-2 border-dashed border-gray-300 p-6 text-center transition-all hover:border-blue-400 hover:bg-blue-50 sm:p-8 relative">
        <input
          type="file"
          id="product-image-upload"
          multiple
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleProductImageSelect}
        />
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          </div>
          <span className="text-sm font-medium text-gray-700">Click để chọn ảnh hoặc kéo thả vào đây</span>
          <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (tối đa 5MB/file)</span>
        </div>
      </div>

      {productImages.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {productImages.map((img, idx) => (
            <div key={idx} className="group relative aspect-square overflow-hidden rounded-xl border border-gray-100 bg-gray-50 shadow-sm transition-all hover:shadow-md">
              <img src={img.url || img.preview} alt="SP" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"></div>
              <button
                type="button"
                onClick={() => removeProductImage(idx)}
                className="absolute right-2 top-2 h-7 w-7 rounded-full bg-white/90 text-red-500 shadow-sm transition-transform hover:scale-110 flex items-center justify-center"
              >
                <Trash2 size={14} />
              </button>
              {idx === 0 && (
                <div className="absolute left-2 top-2 rounded-md bg-blue-600 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                  ẢNH CHÍNH
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StepProductImages;
