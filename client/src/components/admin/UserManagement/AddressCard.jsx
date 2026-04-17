import React, { useState } from 'react';
import { Check, Trash2 } from 'lucide-react';
import Badge from '../../common/Badge';

const AddressCard = ({ address, userId, onSetDefault, onDelete }) => {
  const [loading, setLoading] = useState(false);

  const handleSetDefault = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      await onSetDefault(userId, address.id);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) {
      await onDelete(address.id);
    }
  };

  return (
    <div
      className={`p-4 border rounded-lg transition-all ${
        address.isDefault
          ? 'border-gray-900 bg-gray-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <p className="font-semibold text-gray-900">{address.fullName}</p>
            {address.isDefault && <Badge variant="success">Mặc định</Badge>}
          </div>
          <p className="text-sm text-gray-600">{address.phone}</p>
          <p className="text-sm text-gray-600 mt-1">
            {address.street}, {address.city}
            {address.state && `, ${address.state}`}
          </p>
          <p className="text-sm text-gray-600">
            {address.zipCode} - {address.country || 'Vietnam'}
          </p>
        </div>
        <div className="flex gap-2">
          {!address.isDefault && (
            <button
              onClick={handleSetDefault}
              disabled={loading}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Đặt làm mặc định"
            >
              <Check className="w-4 h-4 text-gray-900" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={handleDelete}
              className="p-2 hover:bg-red-100 rounded-lg transition-colors"
              title="Xóa địa chỉ"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressCard;






