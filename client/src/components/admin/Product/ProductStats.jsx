import { Package, AlertTriangle, XCircle, DollarSign } from "lucide-react";
import StatsCard from "../../common/StatsCard";

const ProductStats = ({ products, formatPrice, getTotalStock }) => {
  const stats = [
    {
      title: "Total Products",
      value: products.length,
      icon: Package,
      bgColor: "bg-gray-100",
      iconColor: "text-gray-900",
      borderColor: "border-gray-900",
    },
    {
      title: "Total Value",
      value: formatPrice(
        products.reduce((sum, p) => sum + (p.basePrice || 0), 0)
      ),
      icon: DollarSign,
      bgColor: "bg-gray-100",
      iconColor: "text-gray-900",
      borderColor: "border-gray-900",
    },
    {
      title: "Low Stock",
      value: products.filter((p) => {
        const stock = getTotalStock(p.variants);
        return stock > 0 && stock < 10;
      }).length,
      icon: AlertTriangle,
      bgColor: "bg-gray-100",
      iconColor: "text-gray-700",
      borderColor: "border-gray-700",
    },
    {
      title: "Out of Stock",
      value: products.filter((p) => getTotalStock(p.variants) === 0).length,
      icon: XCircle,
      bgColor: "bg-gray-100",
      iconColor: "text-gray-700",
      borderColor: "border-gray-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default ProductStats;
