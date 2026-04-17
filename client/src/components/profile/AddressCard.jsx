import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const AddressCard = ({ address, onEdit, onDelete, onSetDefault }) => {
  return (
    <div
      onClick={() => !address.isDefault && onSetDefault(address.id)}
      className={`p-6 border transition-colors cursor-pointer ${
        address.isDefault
          ? 'border-gray-900 bg-gray-50'
          : 'border-gray-300'
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-base font-normal text-gray-900">{address.fullName}</h3>
            {address.isDefault && (
              <span className="px-2.5 py-1 bg-black text-white text-[10px] uppercase font-bold tracking-widest">
                Mặc định
              </span>
            )}


          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <span>{address.phone}</span>
            </p>
            <p className="flex items-start gap-2">
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
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
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
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
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
