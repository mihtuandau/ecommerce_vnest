const StatusCard = ({ product, formData, onFormChange, readOnly }) => {
  // Use formData if provided (edit mode), otherwise use product (view mode)
  const data = formData || product || {};
  
  const statusOptions = [
    { value: 'active', label: 'Đang bán', color: 'green' },
    { value: 'draft', label: 'Nháp', color: 'gray' },
    { value: 'inactive', label: 'Ngừng bán', color: 'red' },
  ];

  const colorClasses = {
    green: { border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-700' },
    gray: { border: 'border-gray-500', bg: 'bg-gray-50', text: 'text-gray-700' },
    red: { border: 'border-red-500', bg: 'bg-red-50', text: 'text-red-700' }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-lg mb-5 text-gray-900">Trạng thái</h3>
      
      <div className="space-y-3">
        {statusOptions.map(option => {
          const isActive = data.status === option.value;
          const classes = colorClasses[option.color];
          
          return (
            <label 
              key={option.value}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                isActive 
                  ? `${classes.border} ${classes.bg} ${classes.text}` 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              } ${readOnly ? 'cursor-default opacity-80' : 'cursor-pointer'}`}
            >
              <input 
                type="radio" 
                name="status" 
                value={option.value}
                checked={data.status === option.value}
                onChange={(e) => !readOnly && onFormChange && onFormChange('status', e.target.value)}
                disabled={readOnly}
                className="w-4 h-4"
              />
              <span className={`text-sm font-medium ${
                data.status === option.value ? classes.text : 'text-gray-700'
              }`}>
                {option.label}
              </span>
            </label>
          );
        })}
      </div>

      <div className="mt-5 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span>Cập nhật: {new Date(product?.updatedAt || product?.createdAt || new Date()).toLocaleDateString('vi-VN')}</span>
        </div>
      </div>
    </div>
  );
};

export default StatusCard;