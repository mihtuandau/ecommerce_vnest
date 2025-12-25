import { FaFacebook, FaTwitter, FaPinterest, FaShareAlt } from "react-icons/fa";

const ProductShare = () => {
  return (
    <div className="flex items-center gap-4 text-sm">
      <span className="text-gray-600 font-light">Chia sẻ:</span>
      <div className="flex gap-2">
        <button className="p-2 border border-gray-200 hover:border-[#00a85a] transition-colors text-gray-600 hover:text-[#00a85a]">
          <FaFacebook className="w-4 h-4" />
        </button>
        <button className="p-2 border border-gray-200 hover:border-[#00a85a] transition-colors text-gray-600 hover:text-[#00a85a]">
          <FaTwitter className="w-4 h-4" />
        </button>
        <button className="p-2 border border-gray-200 hover:border-[#00a85a] transition-colors text-gray-600 hover:text-[#00a85a]">
          <FaPinterest className="w-4 h-4" />
        </button>
        <button className="p-2 border border-gray-200 hover:border-[#00a85a] transition-colors text-gray-600 hover:text-[#00a85a]">
          <FaShareAlt className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
export default ProductShare;