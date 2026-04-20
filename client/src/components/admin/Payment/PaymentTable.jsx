import React from 'react';
import { Table, Tooltip, Button } from 'antd';
import { SyncOutlined, CheckCircleOutlined, RollbackOutlined } from '@ant-design/icons';
import {
  getStatusText,
  getMethodText,
} from '../../../utils/paymentHelpers';

const formatVND = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount || 0);
};

const getStatusTextColor = (status) => {
  const styles = {
    SUCCESS: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    PENDING: 'text-amber-600 bg-amber-50 border-amber-100',
    FAILED: 'text-rose-600 bg-rose-50 border-rose-100',
    REFUNDED: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    CANCELLED: 'text-gray-400 bg-gray-50 border-gray-100',
  };
  return styles[status] || 'text-gray-500 bg-gray-50';
};

const PaymentTable = ({
  payments,
  loading,
  onSyncStatus,
  onConfirmSuccess,
  onUpdateStatus,
  currentPage = 1,
  itemsPerPage = 10,
  total = 0,
  onPageChange,
}) => {
  
  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 40,
      align: 'left',
      render: (_, __, index) => (
        <span className="text-gray-500 text-[10px] font-semibold">
          {total - ((currentPage - 1) * itemsPerPage + index)}
        </span>
      ),
    },
    {
      title: 'Đơn hàng & Sản phẩm',
      key: 'order',
      width: 200,
      align: 'left',
      render: (_, record) => (
        <div className="flex flex-col py-2">
          <span className="text-[13px] font-semibold text-slate-800 mb-1 leading-none">
            {record.order?.orderCode || `#${record.orderId}`}
          </span>
          <div className="flex flex-col gap-0.5 mt-1 border-l border-gray-100 pl-2">
            {record.order?.orderItems?.map((item, i) => (
              <span key={i} className="text-[10px] text-gray-500 leading-tight font-semibold">
                - {item.productName} (x{item.quantity})
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      width: 140,
      align: 'left',
      render: (_, record) => {
        const phone = record.order?.guestPhone || record.order?.user?.phone || record.order?.shippingSnapshot?.phone || 'N/A';
        const name = record.order?.user?.name || record.order?.shippingSnapshot?.fullName || 'Khách vãng lai';

        return (
          <div className="flex flex-col py-1">
            <span className="text-[11px] font-semibold text-slate-800 leading-tight mb-1">{name}</span>
            <span className="text-[10px] text-blue-600 font-semibold tracking-tight">{phone}</span>
          </div>
        );
      },
    },
    {
      title: 'Giá trị',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      align: 'left',
      render: (amount, record) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-800 text-[14px] tracking-tighter">{formatVND(amount)}</span>
          <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-tighter">
            Ship: +{formatVND(record.order?.shippingFee || 30000)}
          </span>
        </div>
      ),
    },
    {
      title: 'PTTT',
      key: 'method',
      width: 100,
      align: 'left',
      render: (_, record) => (
        <span className="text-[10px] font-semibold text-slate-800 uppercase tracking-tighter border border-gray-100 px-2 py-0.5 rounded bg-gray-50">
          {getMethodText(record.method)}
        </span>
      ),
    },
    {
      title: 'Thời gian',
      key: 'createdAt',
      width: 140,
      align: 'left',
      render: (_, record) => (
        <div className="flex flex-col py-1">
          <span className="text-[11px] font-semibold text-slate-800 leading-tight mb-0.5">
            {new Date(record.createdAt).toLocaleDateString('vi-VN')}
          </span>
          <span className="text-[10px] text-gray-500 font-semibold flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-gray-200" />
            {new Date(record.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      align: 'left',
      render: (status) => (
        <span className={`px-2 py-0.5 rounded border font-semibold uppercase text-[10px] tracking-widest ${getStatusTextColor(status)}`}>
          {getStatusText(status).toUpperCase()}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 80,
      align: 'left',
      render: (_, record) => {
        const isPending = record.status === 'PENDING';
        const isOnline = record.method !== 'CASH';
        const isSuccess = record.status === 'SUCCESS';

        return (
          <div className="flex items-center justify-start gap-2">
            {isPending && isOnline && (
              <Tooltip title="Đồng bộ">
                <Button size="small" type="text" icon={<SyncOutlined />} onClick={() => onSyncStatus(record)} className="text-blue-500 hover:text-blue-600 p-0" />
              </Tooltip>
            )}
            {isPending && !isOnline && (
              <Tooltip title="Xác nhận">
                <Button size="small" type="text" icon={<CheckCircleOutlined />} onClick={() => onConfirmSuccess(record)} className="text-blue-500 hover:text-blue-600 p-0" />
              </Tooltip>
            )}
            {isSuccess && (
              <Tooltip title="Hoàn tiền">
                <Button size="small" type="text" icon={<RollbackOutlined />} onClick={() => onUpdateStatus(record.id, 'REFUNDED')} className="text-red-500 hover:text-red-600 p-0" />
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={payments}
      loading={loading}
      rowKey="id"
      size="middle"
      scroll={{ x: 1100 }}
      pagination={{
        current: currentPage,
        total: total || payments.length,
        pageSize: itemsPerPage,
        onChange: onPageChange,
        size: 'small',
        showTotal: (total) => <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">Total Pay: {total}</span>,
      }}
      className="reconcile-expert-table [&_.ant-table-cell]:!align-middle [&_.ant-table-cell]:!bg-transparent"
    />
  );
};

export default PaymentTable;






