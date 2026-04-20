import React from 'react';
import { Button, Space, Tooltip, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, CopyOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { formatCurrency, formatDateShort, getStatusText, getDiscountTypeText } from '../../../utils/discountHelpers';

const { Text } = Typography;

const statusClass = (s) => {
  const st = String(s || '').toLowerCase();
  if (st === 'expired') return 'bg-red-50 text-red-600 border-red-100';
  if (st === 'active') return 'bg-green-50 text-green-700 border-green-100 font-semibold';
  return 'bg-gray-100 text-gray-500 border-gray-200 font-semibold';
};

export const getColumns = (mode, context) => {
  const { current, pageSize, onEdit, onDelete } = context;
  const isFlash = mode === 'flash';

  return [
    { title: 'STT', width: 50, render: (_, __, i) => <span className="font-semibold text-gray-500">{(current - 1) * pageSize + i + 1}</span> },
    {
      title: isFlash ? 'Chiến dịch' : 'Mã giảm giá',
      width: 200,
      render: (_, r) => (
        <div>
          <div className="flex items-center gap-1.5"><Text strong className="font-mono text-sm text-slate-800">{r.code}</Text></div>
          <p className="m-0 text-[11px] text-gray-500 font-semibold truncate max-w-[150px]">{r.description || '—'}</p>
        </div>
      )
    },
    { title: 'Giá trị', width: 120, render: (_, r) => <Text strong className={isFlash ? "text-orange-600 font-semibold" : "text-blue-600 font-semibold"}>{getDiscountTypeText(r)}</Text> },
    { title: 'Lượt dùng', width: 100, render: (_, r) => <span className="text-sm font-semibold text-slate-800">{r.usageCount || 0} / {r.usageLimit || '∞'}</span> },
    {
      title: 'Thời gian', width: 160,
      render: (_, r) => <div className="text-[11px] text-gray-500 font-semibold"><div>{formatDateShort(r.startDate)}</div><div>→ {r.endDate ? formatDateShort(r.endDate) : '—'}</div></div>
    },
    {
      title: 'Trạng thái', width: 110,
      render: (_, r) => <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase ${statusClass(r.status)}`}>{getStatusText(r.status)}</span>
    },
    {
      title: 'Thao tác', width: 90,
      render: (_, r) => (
        <Space size={4}>
          <Button type="text" size="small" icon={<EditOutlined />} onClick={() => onEdit(r)} />
          <Button type="text" size="small" danger icon={<DeleteOutlined />} disabled={r.usageCount > 0} onClick={() => onDelete(r)} />
        </Space>
      )
    }
  ];
};
