import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useAddressForm } from '../../hooks/useAddressForm';
import { useAddressManagement } from '../../hooks/useAddressManagement';
import AddressCard from './AddressCard';
import AddressFormModal from './AddressFormModal';

const AddressManager = ({ userId }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const {
    formData,
    provinces,
    districts,
    wards,
    loadingLocations,
    handleProvinceChange,
    handleDistrictChange,
    handleWardChange,
    handleInputChange,
    validateForm,
    resetForm,
    setFormData
  } = useAddressForm(editingAddress);

  const {
    addresses,
    loading,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
  } = useAddressManagement(userId);

  const handleOpenModal = (address = null) => {
    if (address) {
      setEditingAddress(address);
      setFormData(address);
    } else {
      setEditingAddress(null);
      resetForm();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAddress(null);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const success = editingAddress
      ? await updateAddress(editingAddress.id, formData)
      : await createAddress(formData);

    if (success) {
      handleCloseModal();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Địa chỉ của tôi</h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus size={16} />
          Thêm địa chỉ mới
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">Chưa có địa chỉ nào</p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus size={16} />
            Thêm địa chỉ đầu tiên
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={handleOpenModal}
              onDelete={deleteAddress}
              onSetDefault={setDefaultAddress}
            />
          ))}
        </div>
      )}

      <AddressFormModal
        show={showModal}
        title={editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
        formData={formData}
        provinces={provinces}
        districts={districts}
        wards={wards}
        loadingLocations={loadingLocations}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        onInputChange={handleInputChange}
        onProvinceChange={handleProvinceChange}
        onDistrictChange={handleDistrictChange}
        onWardChange={handleWardChange}
      />
    </div>
  );
};

export default AddressManager;
