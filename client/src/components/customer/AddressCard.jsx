import React from 'react';
import { FaEdit, FaTrash, FaHome, FaBuilding } from 'react-icons/fa';

const AddressCard = ({ address, onEdit, onDelete, onSetDefault }) => {
  return (
    <div
      onClick={() => !address.isDefault && onSetDefault(address.id)}
      className={`p-5 rounded-lg border-2 transition-all cursor-pointer ${
        address.isDefault
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{address.fullName}</h3>
            {address.isDefault && (
              <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full font-medium">
                Mặc định
              </span>
            )}
          </div>
          
          <div className="space-y-1.5 text-gray-600">
            <p className="flex items-center gap-2">
              <span className="text-sm">📞</span>
              <span>{address.phone}</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-sm mt-0.5">📍</span>
              <span className="flex-1">
                {address.street}, {address.ward}, {address.state}, {address.city}
              </span>
            </p>
           
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(address);
            }}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Chỉnh sửa"
          >
            <FaEdit size={14} />
          </button>
          {!address.isDefault && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(address.id);
              }}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Xóa"
            >
              <FaTrash size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
