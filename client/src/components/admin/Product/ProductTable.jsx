import { memo } from 'react';
import Table from "../../common/Table";
import Pagination from "../../common/Pagination";
import ProductRow from "./ProductRow";

const ProductTable = ({
  products,
  loading,
  totalPages,
  currentPage,
  onEdit,
  onDelete,
  onDuplicate,
  onManageVariants,
  onRefresh,
  selectedProducts,
  onSelectAll,
  onSelectProduct,
  onPageChange,
}) => {
  const SkeletonRow = () => (
    <Table.Row hover={false}>
      <Table.Cell><div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div></Table.Cell>
      <Table.Cell>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded animate-pulse"></div>
          <div className="flex-1 min-w-0">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
        </div>
      </Table.Cell>
      <Table.Cell><div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div></Table.Cell>
      <Table.Cell><div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div></Table.Cell>
      <Table.Cell><div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div></Table.Cell>
      <Table.Cell><div className="h-4 bg-gray-200 rounded w-10 animate-pulse"></div></Table.Cell>
      <Table.Cell className="text-right">
        <div className="flex justify-end gap-1">
          <div className="w-7 h-7 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-7 h-7 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-7 h-7 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </Table.Cell>
    </Table.Row>
  );

  return (
    <div>
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Header className="w-12">
              <input
                type="checkbox"
                checked={
                  selectedProducts.length === products.length &&
                  products.length > 0
                }
                onChange={onSelectAll}
                className="w-4 h-4 text-gray-900 rounded focus:ring-gray-500"
              />
            </Table.Header>
            <Table.Header>Sản Phẩm</Table.Header>
            <Table.Header>Category</Table.Header>
            <Table.Header>Giá</Table.Header>
            <Table.Header>Tồn Kho</Table.Header>
            <Table.Header>Variants</Table.Header>
            <Table.Header className="text-right">Hành Động</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <SkeletonRow key={index} />
            ))
          ) : products.length === 0 ? (
            <Table.Empty message="Không có sản phẩm nào" colSpan={7} />
          ) : (
            products.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                isSelected={selectedProducts.includes(product.id)}
                onSelect={() => onSelectProduct(product.id)}
                onEdit={onEdit}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                onManageVariants={onManageVariants}
                onRefresh={onRefresh}
              />
            ))
          )}
        </Table.Body>
      </Table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default memo(ProductTable);
