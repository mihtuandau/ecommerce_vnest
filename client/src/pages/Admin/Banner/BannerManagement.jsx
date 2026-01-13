import { useState } from 'react';
import { Plus, Image as ImageIcon } from 'lucide-react';
import { notify } from '../../../utils/notification';
import Button from '../../../components/common/Button';
import DeleteConfirmModal from '../../../components/common/DeleteConfirm';
import BannerFormModal from '../../../components/admin/Banner/BannerForm';
import BannerTable from '../../../components/admin/Banner/BannerTable';
import { 
  useBanners, 
  useCreateBanner, 
  useUpdateBanner, 
  useDeleteBanner,
  useReorderBanner 
} from '../../../hooks/useBanners';

const BannerManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [showAllBanners, setShowAllBanners] = useState(false);

  const { data: banners = [], isLoading, refetch } = useBanners(!showAllBanners);
  const createMutation = useCreateBanner();
  const updateMutation = useUpdateBanner();
  const deleteMutation = useDeleteBanner();
  const reorderMutation = useReorderBanner();

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
      await deleteMutation.mutateAsync(bannerToDelete.id);
      setDeleteModalOpen(false);
      setBannerToDelete(null);
    } catch (error) {
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingBanner) {
        await updateMutation.mutateAsync({ id: editingBanner.id, formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      setShowForm(false);
      setEditingBanner(null);
    } catch (error) {
      throw error;
    }
  };

  const handleCloseForm = () => {
    setEditingBanner(null);
    setShowForm(false);
  };

  const handleReorder = async (bannerId, direction) => {
    const currentIndex = banners.findIndex(b => b.id === bannerId);
    
    if (direction === 'up' && currentIndex > 0) {
      await reorderMutation.mutateAsync({ bannerId, direction });
    } else if (direction === 'down' && currentIndex < banners.length - 1) {
      await reorderMutation.mutateAsync({ bannerId, direction });
    }
  };

  return (
    <div>
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

      <BannerTable
        banners={banners}
        loading={isLoading}
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
