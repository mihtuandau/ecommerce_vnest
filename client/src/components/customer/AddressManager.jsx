import { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaMapMarkerAlt, 
  FaCheck, 
  FaStar,
  FaHome,
  FaBuilding
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Input from '../common/Input';
import userService from '../../services/userService';

const AddressManager = ({ userId, onAddressSelect, compact = false }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false,
    addressType: 'home'
  });

  const addressTypes = [
    { value: 'home', label: 'Nhà riêng', icon: FaHome, color: 'text-blue-600' },
    { value: 'office', label: 'Văn phòng', icon: FaBuilding, color: 'text-green-600' },
    { value: 'other', label: 'Khác', icon: FaMapMarkerAlt, color: 'text-gray-600' }
  ];

  useEffect(() => {
    if (userId) {
      loadAddresses();
    }
  }, [userId]);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const response = await userService.getAddresses(userId);
      setAddresses(response.addresses || response.data?.addresses || []);
    } catch (error) {
      console.error('Failed to load addresses:', error);
      toast.error('Không thể tải danh sách địa chỉ');
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (address = null) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        fullName: address.fullName || '',
        phone: address.phone || '',
        street: address.street || '',
        city: address.city || '',
        state: address.state || '',
        zipCode: address.zipCode || '',
        isDefault: address.isDefault || false,
        addressType: address.addressType || 'home'
      });
    } else {
      setEditingAddress(null);
      setFormData({
        fullName: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        isDefault: false,
        addressType: 'home'
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!formData.fullName.trim()) {
      toast.error('Vui lòng nhập họ tên');
      return;
    }
    
    if (!formData.phone.trim() || !/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(formData.phone.replace(/\s/g, ''))) {
      toast.error('Số điện thoại không hợp lệ');
      return;
    }
    
    if (!formData.street.trim()) {
      toast.error('Vui lòng nhập địa chỉ');
      return;
    }
    
    if (!formData.city.trim()) {
      toast.error('Vui lòng nhập thành phố');
      return;
    }

    try {
      if (editingAddress) {
        await userService.updateAddress(userId, editingAddress.id, formData);
        toast.success('Cập nhật địa chỉ thành công');
      } else {
        await userService.createAddress(userId, formData);
        toast.success('Thêm địa chỉ mới thành công');
      }
      await loadAddresses();
      setShowModal(false);
    } catch (error) {
      console.error('Address operation error:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) return;

    try {
      await userService.deleteAddress(userId, addressId);
      toast.success('Đã xóa địa chỉ');
      await loadAddresses();
    } catch (error) {
      console.error('Delete address error:', error);
      toast.error(error.response?.data?.message || 'Không thể xóa địa chỉ');
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await userService.setDefaultAddress(userId, addressId);
      toast.success('Đã đặt làm địa chỉ mặc định');
      await loadAddresses();
    } catch (error) {
      console.error('Set default error:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className={compact ? 'space-y-3' : 'space-y-4'}>
      {!compact && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-black">Địa chỉ đã lưu</h3>
          <Button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
          >
            <FaPlus size={14} />
            Thêm địa chỉ mới
          </Button>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
          <FaMapMarkerAlt className="mx-auto text-gray-400 mb-3" size={48} />
          <p className="text-gray-600 mb-4">Chưa có địa chỉ nào được lưu</p>
          <Button onClick={() => handleOpenModal()} variant="primary">
            Thêm địa chỉ đầu tiên
          </Button>
        </div>
      ) : (
        <div className={`space-y-${compact ? '2' : '3'}`}>
          {addresses.map((address) => {
            const addressType = addressTypes.find(type => type.value === address.addressType);
            const Icon = addressType?.icon || FaMapMarkerAlt;
            const color = addressType?.color || 'text-gray-600';
            
            return (
              <div
                key={address.id}
                className={`bg-white border rounded-xl p-4 hover:shadow-md transition-all cursor-pointer ${
                  address.isDefault 
                    ? 'border-black border-2' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onAddressSelect && onAddressSelect(address)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`w-5 h-5 ${color}`} />
                      <span className="font-bold text-black">{address.fullName}</span>
                      {address.isDefault && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-black text-white text-xs font-bold rounded-full">
                          <FaStar size={10} />
                          Mặc định
                        </span>
                      )}
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {addressType?.label || 'Địa chỉ'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-1 flex items-center gap-2">
                      <span className="font-medium">📱</span>
                      {address.phone}
                    </p>
                    <p className="text-gray-800">
                      {address.street}, {address.state ? `${address.state}, ` : ''}{address.city}
                      {address.zipCode && `, ${address.zipCode}`}
                    </p>
                  </div>
                  
                  {!compact && (
                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal(address);
                        }}
                        className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <FaEdit size={14} />
                      </button>
                      {!address.isDefault && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(address.id);
                          }}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <FaTrash size={14} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
                
                {!compact && !address.isDefault && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetDefault(address.id);
                      }}
                      className="text-sm text-gray-600 hover:text-black flex items-center gap-2"
                    >
                      <FaCheck size={12} />
                      Đặt làm địa chỉ mặc định
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Address Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
        size="md"
        closeOnOverlayClick={false}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Address Type Selector */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Loại địa chỉ
            </label>
            <div className="grid grid-cols-3 gap-2">
              {addressTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({...formData, addressType: type.value})}
                    className={`flex flex-col items-center justify-center p-3 border rounded-lg transition-all ${
                      formData.addressType === type.value
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${formData.addressType === type.value ? 'text-white' : type.color}`} />
                    <span className="mt-1 text-xs font-medium">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Họ và tên *"
              name="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              required
              placeholder="Nguyễn Văn A"
            />
            <Input
              label="Số điện thoại *"
              name="phone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
              placeholder="0912345678"
            />
          </div>

          <Input
            label="Địa chỉ chi tiết *"
            name="street"
            value={formData.street}
            onChange={(e) => setFormData({...formData, street: e.target.value})}
            required
            placeholder="Số nhà, tên đường, tổ/thôn"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Quận/Huyện *"
              name="state"
              value={formData.state}
              onChange={(e) => setFormData({...formData, state: e.target.value})}
              required
              placeholder="Quận/Huyện"
            />
            <Input
              label="Tỉnh/Thành phố *"
              name="city"
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              required
              placeholder="Tỉnh/Thành phố"
            />
          </div>

          <Input
            label="Mã bưu điện"
            name="zipCode"
            value={formData.zipCode}
            onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
            placeholder="Mã bưu điện (nếu có)"
          />

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={formData.isDefault}
              onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
              className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
            />
            <div className="flex-1">
              <label htmlFor="isDefault" className="block text-sm font-medium text-gray-900 cursor-pointer">
                Đặt làm địa chỉ mặc định
              </label>
              <p className="text-xs text-gray-500">
                Địa chỉ này sẽ được chọn mặc định khi thanh toán
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              onClick={() => setShowModal(false)}
              variant="outline"
              className="flex-1 border-gray-300 hover:border-gray-400"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-black text-white hover:bg-gray-800"
            >
              {editingAddress ? 'Cập nhật' : 'Thêm địa chỉ'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddressManager;