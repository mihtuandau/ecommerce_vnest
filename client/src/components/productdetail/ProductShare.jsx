import { FaFacebook, FaTwitter, FaPinterest, FaLink } from "react-icons/fa";

const ProductShare = () => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-xs text-gray-400 uppercase tracking-wide">Chia sẻ</span>
      <div className="flex gap-1">
        <button className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
          <FaFacebook className="w-4 h-4" />
        </button>
        <button className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
          <FaTwitter className="w-4 h-4" />
        </button>
        <button className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
          <FaPinterest className="w-4 h-4" />
        </button>
        <button 
          onClick={handleCopyLink}
          className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
export default ProductShare;





