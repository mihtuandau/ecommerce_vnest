
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

  const csvContent = [
    headers.map(h => `"${h}"`).join(','),
    ...rows.map(row =>
      row
        .map(cell => {

          const escaped = String(cell).replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(',')
    ),
  ].join('\n');

  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(link.href);
};


export const exportSelectedProductsToCSV = (
  selectedIds = [],
  allProducts = [],
  fileName = 'products-selected.csv'
) => {
  const selectedProducts = allProducts.filter(p => selectedIds.includes(p.id));
  exportProductsToCSV(selectedProducts, fileName);
};






