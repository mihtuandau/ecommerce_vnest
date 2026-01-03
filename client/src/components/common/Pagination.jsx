import { memo, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

const Pagination = memo(({ 
  currentPage, 
  totalPages, 
  onPageChange,
  itemsCount,
  totalItems,
  className = '' 
}) => {
  const handlePrevious = useCallback(() => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }, [currentPage, onPageChange]);

  const handleNext = useCallback(() => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, onPageChange]);

  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className={`px-6 py-4 flex items-center justify-between bg-gray-50 ${className}`}>
      <div className="text-sm text-gray-600">
        {itemsCount !== undefined && totalItems !== undefined ? (
          <span>
            Hiển thị <span className="font-medium">{itemsCount}</span> / <span className="font-medium">{totalItems}</span> kết quả
          </span>
        ) : (
          <span>
            Trang <span className="font-medium">{currentPage}</span> / <span className="font-medium">{totalPages}</span>
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="secondary" 
          size="sm" 
          disabled={currentPage === 1}
          onClick={handlePrevious}
        >
          <ChevronLeft className="w-4 h-4" />
          Trước
        </Button>

        <div className="hidden sm:flex gap-1">
          {pageNumbers.map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                disabled={page === currentPage}
                className={`px-3 py-1 text-sm font-medium transition-colors pagination-btn ${
                  page === currentPage
                    ? 'bg-[#00a85a] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {page}
              </button>
            )
          ))}
        </div>

        <Button 
          variant="secondary" 
          size="sm" 
          disabled={currentPage >= totalPages}
          onClick={handleNext}
        >
          Sau
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
});

Pagination.displayName = 'Pagination';

export default Pagination;