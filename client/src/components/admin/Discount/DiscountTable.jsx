import { Edit, Trash2, Eye, Tag } from 'lucide-react';
import Badge from '../../common/Badge';
import Button from '../../common/Button';
import Table from '../../common/Table';
import {
  formatDateShort,
  getStatusVariant,
  getStatusText,
  getDiscountTypeText,
} from '../../../utils/discountHelpers';

const DiscountTable = ({ discounts, loading, onSort, onView, onEdit, onDelete }) => {
  if (loading) {
    return (
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Header>STT</Table.Header>
            <Table.Header>Mã giảm giá</Table.Header>
            <Table.Header>Mô tả</Table.Header>
            <Table.Header>Giá trị</Table.Header>
            <Table.Header>Ngày bắt đầu</Table.Header>
            <Table.Header>Ngày kết thúc</Table.Header>
            <Table.Header>Lượt dùng</Table.Header>
            <Table.Header>Trạng thái</Table.Header>
            <Table.Header>Thao tác</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Skeleton rows={5} cols={9} />
        </Table.Body>
      </Table>
    );
  }

  if (discounts.length === 0) {
    return (
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Header>STT</Table.Header>
            <Table.Header>Mã giảm giá</Table.Header>
            <Table.Header>Mô tả</Table.Header>
            <Table.Header>Giá trị</Table.Header>
            <Table.Header>Ngày bắt đầu</Table.Header>
            <Table.Header>Ngày kết thúc</Table.Header>
            <Table.Header>Lượt dùng</Table.Header>
            <Table.Header>Trạng thái</Table.Header>
            <Table.Header>Thao tác</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Empty icon={Tag}>
            <p className="text-gray-700 font-medium">Không tìm thấy mã giảm giá nào</p>
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
            onSort={() => onSort('code')}
          >
            Mã giảm giá
          </Table.Header>
          <Table.Header>Mô tả</Table.Header>
          <Table.Header>Giá trị</Table.Header>
          <Table.Header
            sortable
            onSort={() => onSort('startDate')}
          >
            Ngày bắt đầu
          </Table.Header>
          <Table.Header>Ngày kết thúc</Table.Header>
          <Table.Header
            sortable
            onSort={() => onSort('usageCount')}
          >
            Lượt dùng
          </Table.Header>
          <Table.Header>Trạng thái</Table.Header>
          <Table.Header>Thao tác</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {discounts.map((discount, index) => (
          <Table.Row key={discount.id}>
            <Table.Cell>
              <span className="text-sm text-gray-900">{index + 1}</span>
            </Table.Cell>
            <Table.Cell>
              <span className="text-sm font-medium text-gray-900">{discount.code}</span>
            </Table.Cell>
            <Table.Cell>
              <div className="text-sm text-gray-900 max-w-xs truncate" title={discount.description}>
                {discount.description || '-'}
              </div>
            </Table.Cell>
            <Table.Cell>
              <span className="text-sm font-medium text-gray-900">
                {getDiscountTypeText(discount)}
              </span>
            </Table.Cell>
            <Table.Cell>
              <span className="text-sm text-gray-900">
                {formatDateShort(discount.startDate)}
              </span>
            </Table.Cell>
            <Table.Cell>
              <span className="text-sm text-gray-900">
                {discount.endDate ? formatDateShort(discount.endDate) : 'Không giới hạn'}
              </span>
            </Table.Cell>
            <Table.Cell>
              <span className="text-sm text-gray-900">
                {discount.usageCount || 0}
              </span>
            </Table.Cell>
            <Table.Cell>
              <Badge variant={getStatusVariant(discount.status)}>
                {getStatusText(discount.status)}
              </Badge>
            </Table.Cell>
            <Table.Cell>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView(discount)}
                  title="Xem chi tiết"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(discount)}
                  title="Chỉnh sửa"
                >
                  <Edit className="h-4 w-4 text-gray-900" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(discount)}
                  title="Xóa"
                  disabled={discount.usageCount > 0}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default DiscountTable;

