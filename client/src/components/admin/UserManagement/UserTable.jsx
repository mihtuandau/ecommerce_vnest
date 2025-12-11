import React, { useMemo, useState } from 'react';
import { Edit2, Trash2, MapPin } from 'lucide-react';
import Table from '../../common/Table';
import Badge from '../../common/Badge';

const UserTable = ({ users, onEdit, onDelete, onViewAddresses }) => {
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');

  const sortedUsers = useMemo(() => {
    const data = [...users];
    const val = (u) => {
      if (sortBy === 'addresses') return (u.addresses?.length || 0);
      if (sortBy === 'role') return u.role || '';
      if (sortBy === 'email') return (u.email || '').toLowerCase();
      return (u.name || '').toLowerCase();
    };
    data.sort((a, b) => {
      const va = val(a);
      const vb = val(b);
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return data;
  }, [users, sortBy, sortDir]);

  const toggleSort = (key) => {
    if (sortBy === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortDir('asc');
    }
  };

  if (!sortedUsers || sortedUsers.length === 0) {
    return (
      <Table>
        <Table.Empty message="Không tìm thấy người dùng" colSpan={6} />
      </Table>
    );
  }

  return (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Header>STT</Table.Header>
          {[
            { label: 'Người dùng', key: 'name' },
            { label: 'Email', key: 'email' },
            { label: 'Vai trò', key: 'role' },
            { label: 'Địa chỉ', key: 'addresses' }
          ].map(({ label, key }) => (
            <Table.Header
              key={key}
              sortable
              sorted={sortBy === key}
              sortDir={sortDir}
              onClick={() => toggleSort(key)}
            >
              {label}
            </Table.Header>
          ))}
          <Table.Header className="text-right">Thao tác</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {sortedUsers.map((user, idx) => (
          <Table.Row key={user.id}>
            <Table.Cell className="font-medium text-gray-600">
              {idx + 1}
            </Table.Cell>
            <Table.Cell>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-semibold">
                  {(user.name || user.email || '?').charAt(0).toUpperCase()}
                </div>
                <div className="text-sm font-medium text-gray-900">{user.name || '-'}</div>
              </div>
            </Table.Cell>
            <Table.Cell className="text-gray-600">
              {user.email}
            </Table.Cell>
            <Table.Cell>
              <Badge variant={user.role === 'ADMIN' ? 'admin' : 'customer'}>
                {user.role === 'ADMIN' ? 'Admin' : 'Khách hàng'}
              </Badge>
            </Table.Cell>
            <Table.Cell>
              <button
                onClick={() => onViewAddresses(user)}
                className="text-gray-900 hover:text-gray-900 inline-flex items-center gap-1 text-sm transition-colors"
              >
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-50 text-gray-900 rounded-full">
                  <MapPin className="w-4 h-4" />
                  {user.addresses?.length || 0}
                </span>
              </button>
            </Table.Cell>
            <Table.Cell className="text-right space-x-2">
              <button
                onClick={() => onEdit(user)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors inline-flex"
                title="Chỉnh sửa"
              >
                <Edit2 className="w-4 h-4 text-gray-900" />
              </button>
              <button
                onClick={() => onDelete(user)}
                className="p-2 hover:bg-red-100 rounded-lg transition-colors inline-flex"
                title="Xóa"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default UserTable; 
