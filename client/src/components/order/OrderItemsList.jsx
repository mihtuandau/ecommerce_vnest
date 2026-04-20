import OrderItem from "./OrderItem";

const OrderItemsList = ({ items = [] }) => {
  return (
    <div className="border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-5">
        <h2 style={{ fontFamily: 'Inter, sans-serif' }} className="text-sm font-bold text-gray-900 uppercase tracking-widest">
          Sản phẩm đặt hàng
        </h2>
      </div>

      <div className="divide-y divide-gray-100 px-6">
        {items.map((item, idx) => (
          <div key={idx} className="py-5">
            <OrderItem item={item} showReviewButton={false} />
          </div>
        ))}
      </div>
    </div>
  );
};
export default OrderItemsList;






