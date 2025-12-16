import { useState, useEffect } from 'react';
import { Plus, Image as ImageIcon } from 'lucide-react';
import bannerService from '../../../services/bannerService';
import { notify } from '../../../utils/notification';
import Button from '../../../components/common/Button';
import DeleteConfirmModal from '../../../components/common/DeleteConfirm';
import BannerFormModal from '../../../components/admin/Banner/BannerForm';
import BannerTable from '../../../components/admin/Banner/BannerTable';

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [showAllBanners, setShowAllBanners] = useState(false);

  useEffect(() => {
    loadBanners();
  }, [showAllBanners]);

  const loadBanners = async () => {
    try {
      setLoading(true);
      const data = await bannerService.getAll(!showAllBanners);
      setBanners(data);
    } catch (error) {
      notify.error('Không thể tải danh sách banner');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setShowForm(true);
  };

  const handleDelete = (banner) => {
    setBannerToDelete(banner);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await bannerService.delete(bannerToDelete.id);
      notify.success('Xóa banner thành công');
      loadBanners();
      setDeleteModalOpen(false);
      setBannerToDelete(null);
    } catch (error) {
      notify.error('Không thể xóa banner');
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingBanner) {
        await bannerService.update(editingBanner.id, formData);
        notify.success('Cập nhật banner thành công');
      } else {
        await bannerService.create(formData);
        notify.success('Tạo banner thành công');
      }
      loadBanners();
      setShowForm(false);
      setEditingBanner(null);
    } catch (error) {
      notify.error(editingBanner ? 'Không thể cập nhật banner' : 'Không thể tạo banner');
      throw error;
    }
  };

  const handleCloseForm = () => {
    setEditingBanner(null);
    setShowForm(false);
  };

  const handleReorder = async (bannerId, direction) => {
    const currentBanner = banners.find(b => b.id === bannerId);
    const currentIndex = banners.findIndex(b => b.id === bannerId);
    
    let newOrder;
    if (direction === 'up' && currentIndex > 0) {
      newOrder = banners[currentIndex - 1].order;
    } else if (direction === 'down' && currentIndex < banners.length - 1) {
      newOrder = banners[currentIndex + 1].order;
    } else {
      return;
    }

    try {
      await bannerService.reorder(bannerId, newOrder);
      notify.success('Đã thay đổi thứ tự banner');
      loadBanners();
    } catch (error) {
      notify.error('Không thể thay đổi thứ tự banner');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Banner Management</h1>
            <p className="text-gray-600">Quản lý banner hiển thị trên trang chủ</p>
          </div>
          <Button
            onClick={() => {
              setEditingBanner(null);
              setShowForm(true);
            }}
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Thêm Banner
          </Button>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          <Button
            onClick={() => setShowAllBanners(false)}
            variant={!showAllBanners ? 'primary' : 'outline'}
          >
            Banner Active
          </Button>
          <Button
            onClick={() => setShowAllBanners(true)}
            variant={showAllBanners ? 'primary' : 'outline'}
          >
            Tất cả Banner
          </Button>
        </div>
      </div>

      {/* Banner Table */}
      <BannerTable
        banners={banners}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onReorder={handleReorder}
      />

      {/* Banner Form Modal */}
      {showForm && (
        <BannerFormModal
          banner={editingBanner}
          onSave={handleSave}
          onClose={handleCloseForm}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setBannerToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Xóa Banner"
        message={`Bạn có chắc chắn muốn xóa banner "${bannerToDelete?.title}"?`}
      />
    </div>
  );
};

export default BannerManagement;
