import { Link } from 'react-router-dom';
import { FaShoppingBag } from 'react-icons/fa';
import Button from '../common/Button';

const CartEmpty = () => {
  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <div className="bg-white border border-gray-200 p-16">
        <div className="w-24 h-24 border-2 border-gray-300 mx-auto mb-8 flex items-center justify-center">
          <FaShoppingBag className="text-4xl text-gray-400" />
        </div>
        <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">
          Giỏ Hàng Trống
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
          Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm của chúng tôi!
        </p>
        <Link to="/products">
          <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 font-normal transition-colors inline-flex items-center gap-2">
            <FaShoppingBag size={16} />
            Mua Sắm Ngay
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CartEmpty;
