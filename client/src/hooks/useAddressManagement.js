import { useState, useEffect } from 'react';
import { notify } from '../utils/notification';
import addressService from '../services/addressService';

export const useAddressManagement = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const response = await addressService.getAddresses();
      // Handle different response structures
      const addressList = response.addresses || response.data?.addresses || response || [];
      setAddresses(Array.isArray(addressList) ? addressList : []);
    } catch (error) {
      notify.error('Không thể tải danh sách địa chỉ');
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const createAddress = async (addressData) => {
    try {
      const { id, userId, createdAt, updatedAt, ...cleanData } = addressData;
      await addressService.createAddress(cleanData);
      notify.success('Thêm địa chỉ mới thành công');
      await loadAddresses();
      return true;
    } catch (error) {
      notify.error(error.response?.data?.message || 'Có lỗi xảy ra');
      return false;
    }
  };

  const updateAddress = async (addressId, addressData) => {
    try {
      const { id, userId, createdAt, updatedAt, ...cleanData } = addressData;
      await addressService.updateAddress(addressId, cleanData);
      notify.success('Cập nhật địa chỉ thành công');
      await loadAddresses();
      return true;
    } catch (error) {
      notify.error(error.response?.data?.message || 'Có lỗi xảy ra');
      return false;
    }
  };

  const deleteAddress = async (addressId) => {
    if (!window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) return false;
    try {
      await addressService.deleteAddress(addressId);
      notify.success('Đã xóa địa chỉ');
      await loadAddresses();
      return true;
    } catch (error) {
      notify.error('Không thể xóa địa chỉ');
      return false;
    }
  };

  const setDefaultAddress = async (addressId) => {
    try {
      await addressService.setDefaultAddress(addressId);
      notify.success('Đã đặt làm địa chỉ mặc định');
      await loadAddresses();
      return true;
    } catch (error) {
      notify.error('Có lỗi xảy ra');
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
