import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaHistory } from 'react-icons/fa';

export const SearchResultsDropdown = ({ 
  showSearchResults, isSearching, searchResults, searchQuery, handleSearchResultClick, setShowSearchResults 
}) => {
  if (!showSearchResults) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-[9999] animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="p-3 bg-gray-50/50 border-b border-gray-50 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Kết quả tìm kiếm</span>
        {searchResults.length > 0 && <span className="text-[10px] font-bold text-black bg-gray-200 px-2 py-0.5 rounded-full">{searchResults.length} sản phẩm</span>}
      </div>

      <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
        {isSearching ? (
          <div className="p-10 text-center"><div className="animate-spin w-6 h-6 border-2 border-black border-t-transparent rounded-full mx-auto mb-3" /><p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Đang tìm kiếm...</p></div>
        ) : searchResults.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {searchResults.map((product) => {
              const imageUrl = product.images?.[0]?.url || "/placeholder.png";
              const price = product.variants?.[0]?.price || product.basePrice || 0;
              return (
                <Link key={product.id} to={`/products/${product.id}`} onClick={handleSearchResultClick} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-all group">
                  <div className="relative w-14 h-14 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 transition-transform group-hover:scale-105">
                    <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-black transition-colors line-clamp-1">{product.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-black">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)}</span>
                      {product.originalPrice > price && <span className="text-[10px] text-gray-400 line-through">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.originalPrice)}</span>}
                    </div>
                  </div>
                </Link>
              );
            })}
            <Link to={`/products?search=${encodeURIComponent(searchQuery)}`} onClick={() => setShowSearchResults(false)} className="block p-4 text-center text-xs font-bold text-black hover:bg-black hover:text-white transition-all uppercase tracking-widest border-t border-gray-100">
              Xem tất cả kết quả →
            </Link>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-400">
            <FaSearch className="w-8 h-8 mx-auto mb-4 opacity-10" />
            <p className="text-xs font-bold uppercase tracking-widest">Không tìm thấy sản phẩm nào</p>
            <p className="text-[10px] mt-1">Vui lòng thử từ khóa khác</p>
          </div>
        )}
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #eee; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export const SearchInput = ({ searchQuery, setSearchQuery, handleSearchEnter, handleSearchSubmit, setShowSearchResults, placeholder = "Tìm sản phẩm...", className = "", children }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none group-focus-within:text-black transition-colors"><FaSearch size={14} /></div>
    <input
      type="text" placeholder={placeholder} value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onFocus={() => searchQuery.trim().length >= 1 && setShowSearchResults(true)}
      onKeyPress={handleSearchEnter}
      className="w-full pl-12 pr-14 py-3 bg-gray-50 border-none rounded-2xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-black/5 transition-all text-sm font-medium placeholder:text-gray-300"
    />
    {searchQuery.trim() && (
      <button onClick={handleSearchSubmit} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black text-white rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-lg"><FaSearch size={14} /></button>
    )}
    {children}
  </div>
);
