const VariantSummary = ({ product }) => {
  if (!product?.variants || product.variants.length === 0) return null;

  return (
    <div className="mt-4 pt-3 border-t border-gray-200">
      <p className="text-xs text-gray-500 mb-2">
        <strong>Variants hiện tại:</strong> {product.variants.length} variants
      </p>
      <div className="flex flex-wrap gap-2">
        {product.variants.slice(0, 5).map((v, idx) => (
          <span key={idx} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
            {v.size} • {v.color}
          </span>
        ))}
        {product.variants.length > 5 && (
          <span className="inline-flex items-center px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded font-medium">
            +{product.variants.length - 5} khác
          </span>
        )}
      </div>
    </div>
  );
};

export default VariantSummary;
