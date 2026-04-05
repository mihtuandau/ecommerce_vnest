import { Upload, Trash2 } from 'lucide-react';

const VariantImageManager = ({
  existingImages,
  previewUrls,
  selectedExistingImages,
  selectedNewImages,
  deletingImages,
  onSelectExisting,
  onSelectNew,
  onSelectAllExisting,
  onSelectAllNew,
  onDeleteExisting,
  onDeleteSelectedExisting,
  onDeleteNew,
  onDeleteSelectedNew,
  onFileSelect,
}) => {
  const totalImages = existingImages.length + previewUrls.length;
  const remainingSlots = 5 - totalImages;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Ảnh biến thể (không bắt buộc, tối đa 5 ảnh)
      </label>
      <p className="text-xs text-gray-500 mb-2">
        Không upload ảnh riêng thì hệ thống sẽ dùng ảnh sản phẩm mặc định.
      </p>
      
      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <p className="text-xs text-gray-500">Ảnh hiện có ({existingImages.length}):</p>
              <button
                type="button"
                onClick={onSelectAllExisting}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                {selectedExistingImages.length === existingImages.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
              </button>
            </div>
            {selectedExistingImages.length > 0 && (
              <button
                type="button"
                onClick={onDeleteSelectedExisting}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
              >
                <Trash2 size={12} />
                Xóa đã chọn ({selectedExistingImages.length})
              </button>
            )}
          </div>
          <div className="grid grid-cols-5 gap-2">
            {existingImages.map((img) => (
              <div key={img.id} className="relative group aspect-square">
                <img
                  src={img.url}
                  alt=""
                  className={`w-full h-full object-cover rounded-lg border-2 transition-all ${
                    selectedExistingImages.includes(img.id)
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200'
                  }`}
                />
                {/* Checkbox */}
                <div className="absolute top-1 left-1">
                  <input
                    type="checkbox"
                    checked={selectedExistingImages.includes(img.id)}
                    onChange={() => onSelectExisting(img.id)}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                </div>
                {/* Delete single button */}
                <button
                  type="button"
                  onClick={() => onDeleteExisting(img.id)}
                  disabled={deletingImages.includes(img.id)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Images Preview */}
      {previewUrls.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <p className="text-xs text-gray-500">Ảnh mới ({previewUrls.length}):</p>
              <button
                type="button"
                onClick={onSelectAllNew}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                {selectedNewImages.length === previewUrls.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
              </button>
            </div>
            {selectedNewImages.length > 0 && (
              <button
                type="button"
                onClick={onDeleteSelectedNew}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
              >
                <Trash2 size={12} />
                Xóa đã chọn ({selectedNewImages.length})
              </button>
            )}
          </div>
          <div className="grid grid-cols-5 gap-2">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group aspect-square">
                <img
                  src={url}
                  alt=""
                  className={`w-full h-full object-cover rounded-lg border-2 transition-all ${
                    selectedNewImages.includes(index)
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-blue-400'
                  }`}
                />
                {/* Checkbox */}
                <div className="absolute top-1 left-1">
                  <input
                    type="checkbox"
                    checked={selectedNewImages.includes(index)}
                    onChange={() => onSelectNew(index)}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                </div>
                {/* Delete single button */}
                <button
                  type="button"
                  onClick={() => onDeleteNew(index)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      {remainingSlots > 0 && (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-gray-400" />
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Click để upload</span> hoặc kéo thả
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, WEBP | Còn {remainingSlots} slot
            </p>
          </div>
          <input
            id="variant-images-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={onFileSelect}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
};

export default VariantImageManager;
