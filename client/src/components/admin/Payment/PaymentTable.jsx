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
  const colors = {
    SUCCESS: 'text-emerald-500',
    PENDING: 'text-amber-500',
    FAILED: 'text-red-500',
    REFUNDED: 'text-purple-500',
    CANCELLED: 'text-gray-400',
  };
  return colors[status] || 'text-gray-500';
};

const PaymentTable = ({
  payments,
  loading,
  onSyncStatus,
  onConfirmSuccess,
  onUpdateStatus,
  currentPage = 1,
  itemsPerPage = 12,
  total = 0,
  onPageChange,
}) => {
  
  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 40,
      align: 'left',
      render: (_, __, index) => <span className="text-gray-400 text-[10px] font-bold">{(currentPage - 1) * itemsPerPage + index + 1}</span>,
    },
    {
      title: 'Đơn hàng & Sản phẩm',
      key: 'order',
      width: 200,
      align: 'left',
      render: (_, record) => (
        <div className="flex flex-col py-2">
          <span className="text-[13px] font-bold text-slate-900 mb-1 leading-none italic">
            {record.order?.orderCode || `#${record.orderId}`}
          </span>
          <div className="flex flex-col gap-0.5 mt-1 border-l border-gray-100 pl-2">
            {record.order?.orderItems?.map((item, i) => (
              <span key={i} className="text-[10px] text-gray-400 leading-tight italic">
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
      width: 130,
      align: 'left',
      render: (_, record) => {
        const phone = record.order?.guestPhone || record.order?.user?.phone || record.order?.shippingSnapshot?.phone || 'N/A';
        const name = record.order?.user?.name || record.order?.shippingSnapshot?.fullName || 'Khách vãng lai';

        return (
          <div className="flex flex-col py-1">
            <span className="text-[11px] font-bold text-slate-700 leading-tight mb-1">{name}</span>
            <span className="text-[10px] text-blue-500 font-bold tracking-tight">{phone}</span>
          </div>
        );
      },
    },
    {
      title: 'Tiền hàng',
      key: 'subtotal',
      width: 90,
      align: 'left',
      render: (_, record) => (
        <span className="text-[12px] font-medium text-gray-600">
          {formatVND(record.order?.subtotal || 0)}
        </span>
      ),
    },
    {
      title: 'Phí Ship',
      key: 'shipping',
      width: 90,
      align: 'left',
      render: (_, record) => (
        <span className="text-[11px] font-bold text-orange-400">
          +{formatVND(record.order?.taxAmount || 30000)}
        </span>
      ),
    },
    {
      title: 'Giảm giá',
      key: 'discount',
      width: 90,
      align: 'left',
      render: (_, record) => (
        <span className="text-[11px] font-bold text-red-500">
          -{formatVND(record.order?.discountAmount || 0)}
        </span>
      ),
    },
    {
      title: 'Tổng thu (Bank)',
      dataIndex: 'amount',
      key: 'amount',
      width: 110,
      align: 'left',
      render: (amount) => <span className="font-black text-slate-900 text-[14px]">{formatVND(amount)}</span>,
    },
    {
      title: 'PTTT / Ngày',
      key: 'methodDate',
      width: 130,
      align: 'left',
      render: (_, record) => (
        <div className="flex flex-col items-start gap-1 py-1">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
            {getMethodText(record.method)}
          </span>
          <span className="text-[10px] text-gray-300 font-bold uppercase leading-none">
            {new Date(record.createdAt).toLocaleDateString('vi-VN')}
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
        <span className={`font-black uppercase text-[10px] tracking-widest ${getStatusTextColor(status)}`}>
          {getStatusText(status)}
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
        showTotal: (total) => <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Total Pay: {total}</span>,
      }}
      className="reconcile-expert-table [&_.ant-table-cell]:!align-middle [&_.ant-table-cell]:!bg-transparent"
    />
  );
};

export default PaymentTable;
