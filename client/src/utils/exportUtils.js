/**
 * Xuất dữ liệu sản phẩm thành file CSV
 * @param {Array} products - Danh sách sản phẩm
 * @param {String} fileName - Tên file (mặc định: products.csv)
 */
export const exportProductsToCSV = (products = [], fileName = 'products.csv') => {
  if (!Array.isArray(products) || products.length === 0) {
    alert('Không có sản phẩm để xuất');
    return;
  }

  const headers = [
    'ID',
    'Tên sản phẩm',
    'SKU',
    'Danh mục',
    'Thương hiệu',
    'Giá',
    'Tồn kho',
    'Đã bán',
    'Đánh giá',
    'Trạng thái',
    'Biến thể',
  ];

  const rows = products.map((product) => [
    product.id,
    product.name,
    product.sku || '-',
    product.category?.name || '-',
    product.brand?.name || '-',
    product.basePrice || 0,
    product.stock || (product.variants || []).reduce((sum, v) => sum + (v.stock || 0), 0),
    product.soldCount || 0,
    product.averageRating || 0,
    product.isActive !== false ? 'Đang bán' : 'Ngừng bán',
    product.variants?.length || 0,
  ]);

  // Tạo CSV content
  const csvContent = [
    headers.map(h => `"${h}"`).join(','),
    ...rows.map(row =>
      row
        .map(cell => {
          // Escape quotes và wrap trong dấu ngoặc kép để xử lý comma trong giá trị
          const escaped = String(cell).replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(',')
    ),
  ].join('\n');

  // Thêm BOM cho UTF-8 để Excel hiển thị đúng tiếng Việt
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

  // Tạo link tải file
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();

  // Clean up
  URL.revokeObjectURL(link.href);
};

/**
 * Xuất dữ liệu sản phẩm được chọn
 * @param {Array} selectedIds - Danh sách ID sản phẩm được chọn
 * @param {Array} allProducts - Danh sách tất cả sản phẩm
 * @param {String} fileName - Tên file
 */
export const exportSelectedProductsToCSV = (
  selectedIds = [],
  allProducts = [],
  fileName = 'products-selected.csv'
) => {
  const selectedProducts = allProducts.filter(p => selectedIds.includes(p.id));
  exportProductsToCSV(selectedProducts, fileName);
};
