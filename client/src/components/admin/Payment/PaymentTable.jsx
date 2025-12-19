import React from 'react';
import {
  CreditCard,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  DollarSign,
} from 'lucide-react';
import Badge from '../../common/Badge';
import Button from '../../common/Button';
import Table from '../../common/Table';
import {
  formatCurrency,
  formatDate,
  getStatusVariant,
  getStatusText,
  getMethodText,
} from '../../../utils/paymentHelpers';

const getStatusIcon = (status) => {
  const icons = {
    PENDING: Clock,
    SUCCESS: CheckCircle,
    FAILED: XCircle,
    REFUNDED: RefreshCw,
  };
  return icons[status] || Clock;
};

const PaymentTable = ({
  payments,
  loading,
  sortField,
  sortOrder,
  onSort,
  onViewDetail,
}) => {
  if (loading) {
    return (
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Header>STT</Table.Header>
            <Table.Header>ID Giao dịch</Table.Header>
            <Table.Header>Đơn hàng</Table.Header>
            <Table.Header>Khách hàng</Table.Header>
            <Table.Header>Số tiền</Table.Header>
            <Table.Header>Phương thức</Table.Header>
            <Table.Header>Trạng thái</Table.Header>
            <Table.Header>Thời gian</Table.Header>
            <Table.Header>Thao tác</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Skeleton rows={5} cols={9} />
        </Table.Body>
      </Table>
    );
  }

  if (payments.length === 0) {
    return (
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Header>STT</Table.Header>
            <Table.Header>ID Giao dịch</Table.Header>
            <Table.Header>Đơn hàng</Table.Header>
            <Table.Header>Khách hàng</Table.Header>
            <Table.Header>Số tiền</Table.Header>
            <Table.Header>Phương thức</Table.Header>
            <Table.Header>Trạng thái</Table.Header>
            <Table.Header>Thời gian</Table.Header>
            <Table.Header>Thao tác</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Empty icon={DollarSign}>
            <p className="text-gray-700 font-medium">Không có giao dịch nào</p>
          </Table.Empty>
        </Table.Body>
      </Table>
    );
  }

  return (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Header>STT</Table.Header>
          <Table.Header
            sortable
            sorted={sortField === 'id'}
            sortDir={sortOrder}
            onClick={() => onSort('id')}
          >
            ID Giao dịch
          </Table.Header>
          <Table.Header>Đơn hàng</Table.Header>
          <Table.Header>Khách hàng</Table.Header>
          <Table.Header
            sortable
            sorted={sortField === 'amount'}
            sortDir={sortOrder}
            onClick={() => onSort('amount')}
          >
            Số tiền
          </Table.Header>
          <Table.Header>Phương thức</Table.Header>
          <Table.Header>Trạng thái</Table.Header>
          <Table.Header
            sortable
            sorted={sortField === 'createdAt'}
            sortDir={sortOrder}
            onClick={() => onSort('createdAt')}
          >
            Thời gian
          </Table.Header>
          <Table.Header>Thao tác</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {payments.map((payment, index) => {
          const StatusIcon = getStatusIcon(payment.status);
          return (
            <Table.Row key={payment.id}>
              <Table.Cell>
                <span className="text-sm text-gray-900">{index + 1}</span>
              </Table.Cell>
              <Table.Cell>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">
                    #{payment.id}
                  </span>
                </div>
                {payment.transactionId && (
                  <p className="text-xs text-gray-500 mt-1">
                    {payment.transactionId}
                  </p>
                )}
              </Table.Cell>
              <Table.Cell>
                <span className="text-sm text-gray-900">#{payment.orderId}</span>
              </Table.Cell>
              <Table.Cell>
                <div className="text-sm text-gray-900">
                  {payment.order?.user?.name || payment.order?.shippingInfo?.fullName || 'Khách vãng lai'}
                </div>
                <div className="text-xs text-gray-500">
                  {payment.order?.user?.email || payment.order?.guestEmail || 'N/A'}
                </div>
                {payment.order?.guestPhone && (
                  <div className="text-xs text-gray-500">
                    {payment.order?.guestPhone}
                  </div>
                )}
              </Table.Cell>
              <Table.Cell>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(payment.amount)}
                </span>
              </Table.Cell>
              <Table.Cell>
                <Badge variant="info">{getMethodText(payment.method)}</Badge>
              </Table.Cell>
              <Table.Cell>
                <Badge variant={getStatusVariant(payment.status)}>
                  <StatusIcon className="w-3 h-3 mr-1 inline" />
                  {getStatusText(payment.status)}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <span className="text-sm text-gray-500">
                  {formatDate(payment.createdAt)}
                </span>
              </Table.Cell>
              <Table.Cell>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onViewDetail(payment)}
                  icon={Eye}
                >
                  Chi tiết
                </Button>
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};

export default PaymentTable;
