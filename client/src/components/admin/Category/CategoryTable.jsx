import { Edit, Trash2, ImageIcon, FolderOpen } from 'lucide-react';
import Table from '../../common/Table';
import Button from '../../common/Button';

const CategoryTable = ({
  categories,
  loading,
  sortBy,
  sortDir,
  onSort,
  onEdit,
  onDelete,
  currentPage = 1,
  itemsPerPage = 10,
}) => {
  if (loading) {
    return (
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Header>STT</Table.Header>
            <Table.Header>Hình ảnh</Table.Header>
            <Table.Header>Tên danh mục</Table.Header>
            <Table.Header>Số sản phẩm</Table.Header>
            <Table.Header align="right">Thao tác</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Skeleton rows={5} cols={5} />
        </Table.Body>
      </Table>
    );
  }

  if (categories.length === 0) {
    return (
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Header>STT</Table.Header>
            <Table.Header>Hình ảnh</Table.Header>
            <Table.Header>Tên danh mục</Table.Header>
            <Table.Header>Số sản phẩm</Table.Header>
            <Table.Header align="right">Thao tác</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Empty icon={FolderOpen}>
            <p className="text-gray-700 font-medium">Không tìm thấy danh mục nào</p>
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
          <Table.Header>STT</Table.Header>
          <Table.Header>Hình ảnh</Table.Header>
          <Table.Header
            sortable
            sorted={sortBy === 'name'}
            sortDir={sortDir}
            onSort={() => onSort('name')}
          >
            Tên danh mục
          </Table.Header>
          <Table.Header
            sortable
            sorted={sortBy === 'products'}
            sortDir={sortDir}
            onSort={() => onSort('products')}
          >
            Số sản phẩm
          </Table.Header>
          <Table.Header align="right">Thao tác</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {categories.map((category, idx) => (
          <Table.Row key={category.id}>
            <Table.Cell>
              <span className="text-sm text-gray-600">
                {(currentPage - 1) * itemsPerPage + idx + 1}
              </span>
            </Table.Cell>
            <Table.Cell>
              {category.image ? (
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </Table.Cell>
            <Table.Cell>
              <div className="text-sm font-medium text-gray-900">{category.name}</div>
              {category.description && (
                <div className="text-xs text-gray-500 mt-0.5">{category.description}</div>
              )}
            </Table.Cell>
            <Table.Cell>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-900">
                {category._count?.products || 0} sản phẩm
              </span>
            </Table.Cell>
            <Table.Cell align="right">
              <div className="inline-flex gap-1">
                <button
                  onClick={() => onEdit(category)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors inline-flex"
                  title="Chỉnh sửa"
                >
                  <Edit className="w-4 h-4 text-gray-900" />
                </button>
                <button
                  onClick={() => onDelete(category.id)}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors inline-flex"
                  title="Xóa"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default CategoryTable;
