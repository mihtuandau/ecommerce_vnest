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

const getStatusColor = (status) => {
  const colors = { success: 'success', warning: 'warning', error: 'error', default: 'default' };
  return colors[getStatusVariant(status)] || 'default';
};

const statusClass = (status) => {
  const s = String(status || '').toLowerCase();
  if (s === 'expired')  return 'bg-red-50 text-red-600 border border-red-100';
  if (s === 'active')   return 'bg-green-50 text-green-700 border border-green-100';
  if (s === 'upcoming') return 'bg-blue-50 text-blue-700 border border-blue-100';
  return 'bg-gray-100 text-gray-500 border border-gray-200';
};

const DiscountTable = ({
  discounts = [],
  loading,
  mode = 'regular',
  currentPage = 1,
  itemsPerPage = 10,
  total = 0,
  onPageChange,
  onSort,
  onEdit,
  onDelete,
}) => {
  const copyCode = async (code) => {
    if (!code || !navigator?.clipboard) return;
    try { await navigator.clipboard.writeText(code); } catch {}
  };

  // ── CỘT CHO VOUCHER ─────────────────────────────────────────
  const regularColumns = [
    {
      title: 'STT',
      key: 'index',
      width: 52,
      align: 'center',
      render: (_, __, i) => (currentPage - 1) * itemsPerPage + i + 1,
    },
    {
      title: 'Mã giảm giá',
      key: 'code',
      width: 200,
      render: (_, record) => (
        <div>
          <div className="flex items-center gap-1.5">
            <Text strong className="font-mono text-sm">{record.code}</Text>
            <button
              onClick={() => copyCode(record.code)}
              className="text-gray-300 hover:text-gray-500 transition"
              title="Copy"
            >
              <CopyOutlined style={{ fontSize: 11 }} />
            </button>
          </div>
          <p className="m-0 text-[11px] text-gray-400 truncate max-w-[180px]">
            {record.description || '—'}
          </p>
        </div>
      ),
    },
    {
      title: 'Giá trị',
      key: 'value',
      width: 130,
      render: (_, record) => (
        <Text strong className="text-blue-600">{getDiscountTypeText(record)}</Text>
      ),
    },
    {
      title: 'Đơn tối thiểu',
      dataIndex: 'minOrderAmount',
      key: 'minOrderAmount',
      width: 120,
      render: (v) => v ? formatCurrency(Number(v)) : <span className="text-gray-300">—</span>,
    },
    {
      title: 'Lượt dùng',
      key: 'usage',
      width: 100,
      align: 'center',
      render: (_, r) => (
        <span className="text-sm text-gray-700">
          {r.usageCount || 0}
          {r.usageLimit ? <span className="text-gray-400"> / {r.usageLimit}</span> : ''}
        </span>
      ),
    },
    {
      title: 'Hiệu lực',
      key: 'dates',
      width: 170,
      render: (_, r) => (
        <div className="text-[11px] text-gray-500 leading-relaxed">
          <div><ClockCircleOutlined className="mr-1 opacity-50" />{formatDateShort(r.startDate)}</div>
          <div className="text-gray-400">→ {r.endDate ? formatDateShort(r.endDate) : 'Không hạn'}</div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <span className={`inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusClass(status)}`}>
          {getStatusText(status)}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Space size={4}>
          <Tooltip title="Chỉnh sửa">
            <Button type="text" size="small" icon={<EditOutlined />} onClick={() => onEdit(record)} />
          </Tooltip>
          <Tooltip title={record.usageCount > 0 ? 'Không thể xóa mã đã dùng' : 'Xóa'}>
            <Button
              type="text"
              size="small"
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

  // ── CỘT CHO FLASH SALE ──────────────────────────────────────
  const flashColumns = [
    {
      title: 'STT',
      key: 'index',
      width: 52,
      align: 'center',
      render: (_, __, i) => (currentPage - 1) * itemsPerPage + i + 1,
    },
    {
      title: 'Chiến dịch',
      key: 'code',
      width: 220,
      render: (_, record) => (
        <div>
          <div className="flex items-center gap-1.5">
            <Text strong className="font-mono text-sm">{record.code}</Text>
            <button
              onClick={() => copyCode(record.code)}
              className="text-gray-300 hover:text-gray-500 transition"
              title="Copy"
            >
              <CopyOutlined style={{ fontSize: 11 }} />
            </button>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-orange-100 text-orange-600">
              FLASH
            </span>
          </div>
          <p className="m-0 text-[11px] text-gray-400 truncate max-w-[200px]">
            {record.description || '—'}
          </p>
        </div>
      ),
    },
    {
      title: 'Mức giảm',
      key: 'value',
      width: 140,
      render: (_, record) => (
        <Text strong className="text-orange-600">{getDiscountTypeText(record)}</Text>
      ),
    },
    {
      title: 'Đã dùng / Hạn ngạch',
      key: 'usage',
      width: 160,
      render: (_, r) => {
        const used  = Number(r.usageCount || 0);
        const limit = Number(r.usageLimit  || 0);
        const pct   = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
        return (
          <div>
            <span className="text-sm font-semibold text-gray-700">
              {used}{limit > 0 && <span className="text-gray-400 font-normal"> / {limit}</span>}
            </span>
            {limit > 0 && (
              <div className="mt-1 h-1 w-20 rounded-full bg-gray-200">
                <div
                  className="h-1 rounded-full bg-orange-400"
                  style={{ width: `${pct}%` }}
                />
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Thời gian',
      key: 'dates',
      width: 170,
      render: (_, r) => (
        <div className="text-[11px] text-gray-500 leading-relaxed">
          <div><ClockCircleOutlined className="mr-1 opacity-50" />{formatDateShort(r.startDate)}</div>
          <div className="text-gray-400">→ {r.endDate ? formatDateShort(r.endDate) : 'Không hạn'}</div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <span className={`inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusClass(status)}`}>
          {getStatusText(status)}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Space size={4}>
          <Tooltip title="Chỉnh sửa">
            <Button type="text" size="small" icon={<EditOutlined />} onClick={() => onEdit(record)} />
          </Tooltip>
          <Tooltip title={record.usageCount > 0 ? 'Không thể xóa đã có dữ liệu bán' : 'Xóa'}>
            <Button
              type="text"
              size="small"
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

  const columns  = mode === 'flash' ? flashColumns : regularColumns;
  const emptyMsg = mode === 'flash' ? 'Chưa có Flash Sale nào' : 'Chưa có mã giảm giá nào';

  return (
    <Table
      columns={columns}
      dataSource={discounts}
      loading={loading}
      rowKey="id"
      size="small"
      scroll={{ x: mode === 'flash' ? 1100 : 950 }}
      onChange={(_, __, sorter) => sorter.field && onSort?.(sorter.field)}
      pagination={{
        current: currentPage,
        total: total || discounts.length,
        pageSize: itemsPerPage,
        onChange: onPageChange,
        size: 'small',
        showSizeChanger: false,
        showTotal: (n) => `Tổng: ${n} bản ghi`,
      }}
      locale={{
        emptyText: (
          <div className="py-12 flex flex-col items-center text-gray-400">
            <TagOutlined style={{ fontSize: 32, marginBottom: 8 }} />
            <span className="text-sm">{emptyMsg}</span>
          </div>
        ),
      }}
    />
  );
};

export default DiscountTable;
