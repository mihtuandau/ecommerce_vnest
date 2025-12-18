import { FaFacebook, FaTwitter, FaPinterest, FaShareAlt } from "react-icons/fa";

const ProductShare = () => {
  return (
    <div className="flex items-center gap-4 text-sm">
      <span className="text-gray-600 font-light">Chia sẻ:</span>
      <div className="flex gap-2">
        <button className="p-2 border border-gray-200 hover:border-gray-900 transition-colors text-gray-600 hover:text-gray-900">
          <FaFacebook className="w-4 h-4" />
        </button>
        <button className="p-2 border border-gray-200 hover:border-gray-900 transition-colors text-gray-600 hover:text-gray-900">
          <FaTwitter className="w-4 h-4" />
        </button>
        <button className="p-2 border border-gray-200 hover:border-gray-900 transition-colors text-gray-600 hover:text-gray-900">
          <FaPinterest className="w-4 h-4" />
        </button>
        <button className="p-2 border border-gray-200 hover:border-gray-900 transition-colors text-gray-600 hover:text-gray-900">
          <FaShareAlt className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ProductShare;
