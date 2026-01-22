const StatusCard = ({ product, formData, onFormChange }) => {
  const statusOptions = [
    { value: 'active', label: 'Đang bán', color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { value: 'draft', label: 'Nháp', color: 'text-gray-600', bgColor: 'bg-gray-50' },
    { value: 'inactive', label: 'Ngừng bán', color: 'text-red-600', bgColor: 'bg-red-50' },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
      <h3 className="font-semibold mb-4 text-gray-900">Trạng thái</h3>
      
      <div className="space-y-3">
        {statusOptions.map(option => (
          <label 
            key={option.value}
            className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
              formData.status === option.value 
                ? `${option.bgColor} border-current ${option.color}` 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <input 
              type="radio" 
              name="status" 
              value={option.value}
              checked={formData.status === option.value}
              onChange={(e) => onFormChange('status', e.target.value)}
              className="w-4 h-4"
            />
            <span className={`text-sm font-medium ${
              formData.status === option.value ? option.color : 'text-gray-700'
            }`}>
              {option.label}
            </span>
          </label>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span>Cập nhật: {new Date(product.updatedAt || product.createdAt).toLocaleDateString('vi-VN')}</span>
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
