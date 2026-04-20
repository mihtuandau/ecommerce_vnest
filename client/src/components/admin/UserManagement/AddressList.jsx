import React from 'react';
import AddressCard from './AddressCard';

const AddressList = ({ addresses, userId, onSetDefault, onDelete }) => {
  if (!addresses || addresses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Chưa có địa chỉ nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {addresses.map((address) => (
        <AddressCard
          key={address.id}
          address={address}
          userId={userId}
          onSetDefault={onSetDefault}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default AddressList;





