import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import ProfileCard from '../../../components/admin/Profile/ProfileCard';
import ProfileForm from '../../../components/admin/Profile/ProfileForm';
import AddressList from '../../../components/admin/Profile/AddressList';
import AddressModal from '../../../components/admin/Profile/AddressModal';
import { useProfileForm, useAddressForm } from '../../../hooks/useProfileForm';

const ProfilePage = () => {
  const { user: authUser, updateProfile } = useAuth();
  const [addresses, setAddresses] = useState([]);

  const loadAddresses = async () => {
    try {
      setAddresses([]);
    } catch (error) {}
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const {
    profileForm,
    setProfileForm,
    loading: profileLoading,
    handleProfileUpdate,
  } = useProfileForm(authUser, updateProfile);

  const {
    addressForm,
    setAddressForm,
    showAddressModal,
    editingAddress,
    loading: addressLoading,
    openAddressModal,
    closeAddressModal,
    handleAddressSubmit,
    handleDeleteAddress,
  } = useAddressForm(loadAddresses);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
            THÔNG TIN CÁ NHÂN
          </h1>
          <p className="text-gray-600">
            Quản lý thông tin tài khoản và địa chỉ giao hàng của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ProfileCard 
              user={authUser} 
              addressCount={addresses.length}
              formatDate={formatDate}
            />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <ProfileForm
              profileForm={profileForm}
              setProfileForm={setProfileForm}
              onSubmit={handleProfileUpdate}
              loading={profileLoading}
            />

            <AddressList
              addresses={addresses}
              onAdd={() => openAddressModal()}
              onEdit={openAddressModal}
              onDelete={handleDeleteAddress}
            />
          </div>
        </div>
      </div>

      <AddressModal
        isOpen={showAddressModal}
        onClose={closeAddressModal}
        addressForm={addressForm}
        setAddressForm={setAddressForm}
        onSubmit={handleAddressSubmit}
        loading={addressLoading}
        isEditing={!!editingAddress}
      />
    </div>
  );
};

export default ProfilePage;
