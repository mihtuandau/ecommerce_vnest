import { Table, Tag, Button, Space, Tooltip, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, TagOutlined, CopyOutlined, ClockCircleOutlined } from '@ant-design/icons';
import {
  formatCurrency,
  formatDateShort,
  getStatusVariant,
  getStatusText,
  getDiscountTypeText,
} from '../../../utils/discountHelpers';

const { Text } = Typography;

// Map status colors for Ant Design Tags
const getStatusColor = (status) => {
  const colors = {
    success: 'success',
    warning: 'warning',
    error: 'error',
    default: 'default',
  };
  return colors[getStatusVariant(status)] || 'default';
};

const DiscountTable = ({ discounts, loading, mode = 'regular', currentPage = 1, itemsPerPage = 10, total = 0, onPageChange, onSort, onView, onEdit, onDelete }) => {
  const copyCode = async (code) => {
    if (!code || !navigator?.clipboard) return;
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Silent fail to avoid breaking row actions
    }
  };

  const statusClass = (status) => {
    const normalized = String(status || '').toLowerCase();
    if (normalized === 'expired') return 'bg-red-100 text-red-600';
    if (normalized === 'active') return 'bg-emerald-100 text-emerald-700';
    if (normalized === 'upcoming') return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-700';
  };

  const regularColumns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_, __, index) => (currentPage - 1) * itemsPerPage + index + 1,
    },
    {
      title: 'Mã giảm giá',
      dataIndex: 'code',
      key: 'code',
      sorter: true,
      render: (code) => <Text strong>{code}</Text>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: {
        showTitle: true,
      },
      render: (description) => description || '-',
    },
    {
      title: 'Giá trị',
      key: 'value',
      render: (_, record) => (
        <Text strong>{getDiscountTypeText(record)}</Text>
      ),
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      sorter: true,
      render: (startDate) => formatDateShort(startDate),
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (endDate) => endDate ? formatDateShort(endDate) : 'Không giới hạn',
    },
    {
      title: 'Lượt dùng',
      dataIndex: 'usageCount',
      key: 'usageCount',
      sorter: true,
      render: (usageCount) => usageCount || 0,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 110,
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title={record.usageCount > 0 ? 'Không thể xóa mã đã sử dụng' : 'Xóa'}>
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record)}
              disabled={record.usageCount > 0}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const flashColumns = [
    {
      title: <span className="whitespace-nowrap">MÃ CODE</span>,
      dataIndex: 'code',
      key: 'code',
      width: 220,
      render: (code) => (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Text strong>{code}</Text>
          <Tooltip title="Sao chép mã">
            <Button type="text" size="small" icon={<CopyOutlined />} onClick={() => copyCode(code)} />
          </Tooltip>
          <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">FLASH</span>
        </div>
      ),
    },
    {
      title: <span className="whitespace-nowrap">MÔ TẢ</span>,
      dataIndex: 'description',
      key: 'description',
      width: 260,
      render: (description) => (
        <span className="block max-w-[240px] truncate whitespace-nowrap" title={description || '-'}>
          {description || '-'}
        </span>
      ),
    },
    {
      title: <span className="whitespace-nowrap">GIẢM GIÁ</span>,
      key: 'value',
      width: 190,
      render: (_, record) => (
        <div>
          <p className="m-0 text-lg font-semibold text-orange-600">{getDiscountTypeText(record)}</p>
          {record.maxDiscountAmount ? (
            <p className="m-0 text-xs text-gray-500">Tối đa {formatCurrency(record.maxDiscountAmount)}</p>
          ) : null}
        </div>
      ),
    },
    {
      title: <span className="whitespace-nowrap">ĐƠN TỐI THIỂU</span>,
      dataIndex: 'minOrderAmount',
      key: 'minOrderAmount',
      width: 150,
      render: (value) => <span className="whitespace-nowrap">{formatCurrency(Number(value || 0))}</span>,
    },
    {
      title: <span className="whitespace-nowrap">ĐÃ DÙNG</span>,
      key: 'usageCount',
      width: 170,
      render: (_, record) => {
        const usage = Number(record.usageCount || 0);
        const limit = Number(record.usageLimit || 0);
        const pct = limit > 0 ? Math.min(100, Math.round((usage / limit) * 100)) : 0;

        return (
          <div>
            <p className="m-0 text-base font-semibold text-gray-700">
              {usage}
              {limit > 0 ? <span className="text-gray-400">/{limit}</span> : null}
            </p>
            {limit > 0 ? (
              <div className="mt-1 h-1 w-[72px] rounded bg-gray-200">
                <div className="h-1 rounded bg-amber-500" style={{ width: `${pct}%` }} />
              </div>
            ) : null}
          </div>
        );
      },
    },
    {
      title: <span className="whitespace-nowrap">THỜI GIAN</span>,
      key: 'timeRange',
      width: 180,
      render: (_, record) => (
        <div className="text-xs text-gray-600">
          <p className="m-0 inline-flex items-center gap-1"><ClockCircleOutlined /> {formatDateShort(record.startDate)}</p>
          <p className="m-0 mt-1">→ {record.endDate ? formatDateShort(record.endDate) : 'Không giới hạn'}</p>
        </div>
      ),
    },
    {
      title: <span className="whitespace-nowrap">TRẠNG THÁI</span>,
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (status) => (
        <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(status)}`}>
          {getStatusText(status)}
        </span>
      ),
    },
    {
      title: <span className="whitespace-nowrap">THAO TÁC</span>,
      key: 'actions',
      width: 90,
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(record)} />
          </Tooltip>
          <Tooltip title={record.usageCount > 0 ? 'Không thể xóa mã đã sử dụng' : 'Xóa'}>
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record)}
              disabled={record.usageCount > 0}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter.field) {
      onSort(sorter.field);
    }
  };

  const columns = mode === 'flash' ? flashColumns : regularColumns;
  const emptyLabel = mode === 'flash' ? 'Không tìm thấy Flash Sale nào' : 'Không tìm thấy mã giảm giá nào';

  return (
    <Table
      columns={columns}
      dataSource={discounts}
      loading={loading}
      scroll={mode === 'flash' ? { x: 1280 } : undefined}
      rowKey="id"
      onChange={handleTableChange}
      size="small"
      pagination={{
        current: currentPage,
        total: total || discounts.length,
        pageSize: itemsPerPage,
        showSizeChanger: true,
        showTotal: (count) => mode === 'flash' ? `Hiển thị ${count} Flash Sale` : `Hiển thị ${count} mã giảm giá`,
        onChange: onPageChange,
        size: 'small',
        position: ['bottomRight'],
      }}
      locale={{
        emptyText: (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <TagOutlined style={{ fontSize: 48, color: '#bfbfbf', marginBottom: 16 }} />
            <div style={{ fontWeight: 500 }}>{emptyLabel}</div>
          </div>
        ),
      }}
      className="[&_.ant-table-thead>tr>th]:bg-gray-50 [&_.ant-table-thead>tr>th]:font-medium [&_.ant-table-thead>tr>th]:text-gray-700 [&_.ant-table-thead>tr>th]:border-b [&_.ant-table-thead>tr>th]:border-gray-200 [&_.ant-table-thead>tr>th]:px-2 [&_.ant-table-thead>tr>th]:py-2 [&_.ant-table-tbody>tr>td]:px-2 [&_.ant-table-tbody>tr>td]:py-2"
    />
  );
};

export default DiscountTable;

