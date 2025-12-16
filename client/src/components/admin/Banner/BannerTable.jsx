import { Edit, Trash2, ImageIcon, ArrowUp, ArrowDown } from 'lucide-react';
import Table from '../../common/Table';
import Button from '../../common/Button';

const BannerTable = ({
  banners,
  loading,
  onEdit,
  onDelete,
  onReorder,
}) => {
  if (loading) {
    return (
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Header>STT</Table.Header>
            <Table.Header>Hình ảnh</Table.Header>
            <Table.Header>Tiêu đề</Table.Header>
            <Table.Header>Button Text</Table.Header>
            <Table.Header>Thứ tự</Table.Header>
            <Table.Header>Trạng thái</Table.Header>
            <Table.Header align="right">Thao tác</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Skeleton rows={5} cols={7} />
        </Table.Body>
      </Table>
    );
  }

  if (banners.length === 0) {
    return (
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Header>STT</Table.Header>
            <Table.Header>Hình ảnh</Table.Header>
            <Table.Header>Tiêu đề</Table.Header>
            <Table.Header>Button Text</Table.Header>
            <Table.Header>Thứ tự</Table.Header>
            <Table.Header>Trạng thái</Table.Header>
            <Table.Header align="right">Thao tác</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Empty icon={ImageIcon}>
            <p className="text-gray-700 font-medium">Không tìm thấy banner nào</p>
            <p className="text-sm text-gray-500">Hãy thêm banner mới</p>
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
          <Table.Header>Tiêu đề</Table.Header>
          <Table.Header>Button Text</Table.Header>
          <Table.Header>Thứ tự</Table.Header>
          <Table.Header>Trạng thái</Table.Header>
          <Table.Header align="right">Thao tác</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {banners.map((banner, idx) => (
          <Table.Row key={banner.id}>
            <Table.Cell>
              <span className="text-sm text-gray-600">{idx + 1}</span>
            </Table.Cell>
            <Table.Cell>
              {banner.image ? (
                <img 
                  src={banner.image} 
                  alt={banner.title}
                  className="w-20 h-12 object-cover rounded-lg border border-gray-200"
                />
              ) : (
                <div className="w-20 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </Table.Cell>
            <Table.Cell>
              <div>
                <p className="font-medium text-gray-900">{banner.title}</p>
                {banner.subtitle && (
                  <p className="text-sm text-gray-500 mt-0.5">{banner.subtitle}</p>
                )}
              </div>
            </Table.Cell>
            <Table.Cell>
              <span className="text-sm text-gray-700">{banner.buttonText || 'Mua ngay'}</span>
            </Table.Cell>
            <Table.Cell>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  #{banner.order}
                </span>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => onReorder(banner.id, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Di chuyển lên"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onReorder(banner.id, 'down')}
                    disabled={idx === banners.length - 1}
                    className="p-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Di chuyển xuống"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </Table.Cell>
            <Table.Cell>
              <span
                className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                  banner.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {banner.isActive ? 'Active' : 'Inactive'}
              </span>
            </Table.Cell>
            <Table.Cell align="right">
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(banner)}
                  title="Sửa banner"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(banner)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  title="Xóa banner"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default BannerTable;
