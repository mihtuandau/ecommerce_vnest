import { Upload, X } from 'lucide-react';
import { Button } from 'antd';
import { CARD_CLASS, CONTROL_SIZE, PRIMARY_BTN_CLASS } from './formConstants';

export const ImagesSection = ({
  productImages,
  setProductImages,
  removeProductImage,
  updateProductImage,
  handleProductImageSelect,
}) => {
  return (
    <div className={CARD_CLASS + ' p-6'}>
      <div className="flex items-baseline justify-between mb-6">
        <span className="text-base font-semibold text-gray-900">Ảnh sản phẩm</span>
        <span className="text-xs text-gray-500">Tùy chọn</span>
      </div>

      {productImages && productImages.length > 0 ? (
        <div className="grid grid-cols-4 gap-3 mb-6">
          {productImages.map((img) => (
            <div key={img.tempId} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border-2 border-[#E6E8EC] group-hover:border-[#37A76B] transition-colors">
                <img src={img.preview || img.url} alt="" className="w-full h-full object-cover" />
              </div>
              <Button
                type="text"
                danger
                icon={<X size={16} />}
                onClick={() => removeProductImage(img.tempId)}
                className="absolute -top-2 -right-2 group-hover:opacity-100 opacity-0 transition-opacity"
              />
            </div>
          ))}
        </div>
      ) : null}

      <div className="mb-6 p-6 border-2 border-dashed border-[#E6E8EC] rounded-lg bg-gray-50 cursor-pointer hover:border-[#37A76B] hover:bg-green-50 transition-all"
           onClick={() => document.getElementById('productImageUpload').click()}>
        <Upload size={24} className="mx-auto mb-2 text-gray-400 group-hover:text-[#37A76B]" />
        <p className="text-center text-sm text-gray-600 font-medium">Kéo ảnh vào hoặc nhấp để chọn</p>
        <p className="text-center text-xs text-gray-500 mt-1">Định dạng: JPG, PNG (tối đa 10MB)</p>
        <input
          id="productImageUpload"
          type="file"
          multiple
          accept="image/*"
          onChange={handleProductImageSelect}
          className="hidden"
        />
      </div>

      {productImages && productImages.length > 0 && (
        <div className="space-y-2">
          {productImages.map((img) => (
            <div key={img.tempId} className="flex gap-2 items-center p-2 bg-gray-50 rounded-lg">
              <img src={img.preview || img.url} alt="" className="w-10 h-10 object-cover rounded" />
              <input
                placeholder="Alt text (mô tả ảnh cho SEO)"
                value={img.altText}
                onChange={(e) =>
                  updateProductImage(img.tempId, { altText: e.target.value })
                }
                size="small"
                className="text-xs flex-1 px-2 py-1 border rounded"
              />
              <Button
                type="text"
                danger
                icon={<X size={16} />}
                onClick={() => removeProductImage(img.tempId)}
                className="hover:bg-red-50 flex-shrink-0"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImagesSection;
