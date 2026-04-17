import OrderItem from "./OrderItem";

const OrderItemsList = ({ items = [] }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Sản phẩm đặt hàng
        </h2>
      </div>

      <div className="divide-y divide-slate-200 px-5">
        {items.map((item, idx) => (
          <div key={idx} className="py-3.5 first:pt-4 last:pb-4">
            <OrderItem item={item} showReviewButton={false} />
          </div>
        ))}
      </div>
    </div>
  );
};
export default OrderItemsList;






