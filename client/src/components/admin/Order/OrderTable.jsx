import { Eye, Package } from 'lucide-react';
import Badge from '../../common/Badge';
import Table from '../../common/Table';
import { formatCurrency, formatDate, statusVariants, statusLabels } from '../../../utils/orderHelpers';

const OrderTable = ({ orders, loading, sortBy, sortDir, onSort, onViewDetails }) => {
  if (loading) {
    return (
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Header>Mã đơn</Table.Header>
            <Table.Header>Khách hàng</Table.Header>
            <Table.Header>Tổng tiền</Table.Header>
            <Table.Header>Trạng thái</Table.Header>
            <Table.Header>Ngày đặt</Table.Header>
            <Table.Header align="right">Thao tác</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Skeleton rows={5} cols={6} />
        </Table.Body>
      </Table>
    );
  }

  if (orders.length === 0) {
    return (
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Header>Mã đơn</Table.Header>
            <Table.Header>Khách hàng</Table.Header>
            <Table.Header>Tổng tiền</Table.Header>
            <Table.Header>Trạng thái</Table.Header>
            <Table.Header>Ngày đặt</Table.Header>
            <Table.Header align="right">Thao tác</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Empty icon={Package}>
            <p className="text-gray-700 font-medium">Không tìm thấy đơn hàng phù hợp</p>
            <p className="text-sm text-gray-500">Thử thay đổi từ khóa tìm kiếm</p>
          </Table.Empty>
        </Table.Body>
      </Table>
    );
  }

  return (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Header>Mã đơn</Table.Header>
          <Table.Header>Khách hàng</Table.Header>
          <Table.Header 
            sortable 
            sorted={sortBy === 'total'}
            sortDir={sortDir}
            onSort={() => onSort('total')}
          >
            Tổng tiền
          </Table.Header>
          <Table.Header>Trạng thái</Table.Header>
          <Table.Header
            sortable
            sorted={sortBy === 'createdAt'}
            sortDir={sortDir}
            onSort={() => onSort('createdAt')}
          >
            Ngày đặt
          </Table.Header>
          <Table.Header align="right">Thao tác</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {orders.map((order) => (
          <Table.Row key={order.id}>
            <Table.Cell>
              <span className="text-sm font-medium text-gray-900">
                {order.orderCode || `#${order.id}`}
              </span>
            </Table.Cell>
            <Table.Cell>
              <div className="text-sm font-medium text-gray-900">
                {order.user?.name || order.shippingInfo?.fullName || order.guestEmail || 'Khách vãng lai'}
              </div>
              <div className="text-xs text-gray-500">
                {order.user?.email || order.guestEmail || order.guestPhone || 'N/A'}
              </div>
            </Table.Cell>
            <Table.Cell>
              <span className="text-sm font-medium text-gray-900">
                {formatCurrency(order.total)}
              </span>
            </Table.Cell>
            <Table.Cell>
              <Badge variant={statusVariants[order.status]}>
                {statusLabels[order.status]}
              </Badge>
            </Table.Cell>
            <Table.Cell>
              <span className="text-sm text-gray-600">
                {formatDate(order.createdAt)}
              </span>
            </Table.Cell>
            <Table.Cell align="right">
              <button
                onClick={() => onViewDetails(order)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors inline-flex"
                title="Xem chi tiết"
              >
                <Eye className="w-4 h-4 text-gray-900" />
              </button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default OrderTable;
