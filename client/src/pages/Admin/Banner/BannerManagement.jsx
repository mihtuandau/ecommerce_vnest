import { useEffect, useMemo, useState } from 'react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const paginatedBanners = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return banners.slice(start, start + itemsPerPage);
  }, [banners, currentPage]);

  const totalPages = Math.max(1, Math.ceil(banners.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="mb-1 text-2xl font-bold text-gray-900">Quản lý Banner</h1>
              <p className="text-sm text-gray-500">Quản lý banner hiển thị trên trang chủ</p>
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

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <BannerTable
            banners={paginatedBanners}
            loading={isLoading}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            total={banners.length}
            onPageChange={(page) => setCurrentPage(page)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onReorder={handleReorder}
          />
        </div>

        {}
        {showForm && (
          <BannerFormModal
            banner={editingBanner}
            onSave={handleSave}
            onClose={handleCloseForm}
          />
        )}

        {}
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
    </div>
  );
};

export default BannerManagement;






