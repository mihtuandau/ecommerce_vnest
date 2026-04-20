import { Upload, X } from 'lucide-react';

const ImageUploadSection = ({ 
  product, 
  images, 
  uploading, 
  onImageUpload, 
  onRemoveImage 
}) => {
  return (
    <div>
      <label className="text-base font-semibold text-gray-900 mb-3 block">
        Hình Ảnh Sản Phẩm
      </label>
      
      {!product?.id && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
          <p className="text-xs text-yellow-800">
             Vui lòng <strong>lưu sản phẩm trước</strong> để upload ảnh
          </p>
        </div>
      )}

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
        <input
          type="file"
          id="image-upload"
          multiple
          accept="image}
      {images.length > 0 && (
        <div className="mt-4">
          <p className="text-xs text-gray-600 mb-2">
            {images.length} ảnh
          </p>
          <div className="grid grid-cols-4 gap-3">
            {images.map((img, index) => (
              <div key={img.id || index} className="relative group">
                <div className="aspect-square rounded overflow-hidden border border-gray-200">
                  <img
                    src={img.url}
                    alt={img.altText}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {img.isThumbnail && (
                  <span className="absolute top-1 left-1 bg-[#1890ff] text-white text-[10px] px-1.5 py-0.5 rounded">
                    Main
                  </span>
                )}
                
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onRemoveImage(img, index);
                  }}
                  className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                >
                  <X size={14} />
                </button>
                
                <p className="mt-1 text-[10px] text-gray-600 truncate">
                  {img.altText}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadSection;





