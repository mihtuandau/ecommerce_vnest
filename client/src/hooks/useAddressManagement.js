import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import userService from '../services/userService';

export const useAddressManagement = (userId) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

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
      toast.error('Không thể tải danh sách địa chỉ');
    } finally {
      setLoading(false);
    }
  };

  const createAddress = async (addressData) => {
    try {
      await userService.createAddress(userId, addressData);
      toast.success('Thêm địa chỉ mới thành công');
      await loadAddresses();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
      return false;
    }
  };

  const updateAddress = async (addressId, addressData) => {
    try {
      await userService.updateAddress(userId, addressId, addressData);
      toast.success('Cập nhật địa chỉ thành công');
      await loadAddresses();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
      return false;
    }
  };

  const deleteAddress = async (addressId) => {
    if (!window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) return false;
    try {
      await userService.deleteAddress(userId, addressId);
      toast.success('Đã xóa địa chỉ');
      await loadAddresses();
      return true;
    } catch (error) {
      toast.error('Không thể xóa địa chỉ');
      return false;
    }
  };

  const setDefaultAddress = async (addressId) => {
    try {
      await userService.setDefaultAddress(userId, addressId);
      toast.success('Đã đặt làm địa chỉ mặc định');
      await loadAddresses();
      return true;
    } catch (error) {
      toast.error('Có lỗi xảy ra');
      return false;
    }
  };

  return {
    addresses,
    loading,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    refreshAddresses: loadAddresses
  };
};
