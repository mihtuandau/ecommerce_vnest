import { Plus, MapPin, Phone, Edit2, Trash2 } from 'lucide-react';
import Button from '../../common/Button';

const AddressList = ({ addresses, onAdd, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Địa chỉ giao hàng</h3>
        <Button onClick={onAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm địa chỉ
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Chưa có địa chỉ giao hàng</p>
          <p className="text-sm text-gray-400 mt-1">Thêm địa chỉ để dễ dàng đặt hàng</p>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div key={address.id} className="border rounded-lg p-4 hover:border-blue-500 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-medium text-gray-900">{address.fullName}</p>
                    {address.isDefault && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        Mặc định
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    <Phone className="w-3 h-3 inline mr-1" />
                    {address.phone}
                  </p>
                  <p className="text-sm text-gray-600">
                    <MapPin className="w-3 h-3 inline mr-1" />
                    {address.street}, {address.city}, {address.state} {address.zipCode}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(address)}
                    className="p-2 text-[#1890ff] hover:bg-blue-50 rounded-lg"
                    title="Chỉnh sửa"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(address.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressList;
