const TopBar = () => {
  return (
    <div className="border-b border-gray-200 bg-blue-700 hidden lg:block">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-xs">
        {/* Hotline / Contact (Left) */}
        <div className="flex items-center gap-6">
          <span className="text-white font-medium">📞 Hotline: 1900-1234</span>
          <span className="text-white">✉️ Email: support@meumarket.vn</span>
        </div>

        {/* Promotions (Right) */}
        <div className="flex items-center gap-4">
          <span className="text-white font-semibold">🎉 Giảm giá đến 50%</span>
          <span className="text-white font-semibold">🚚 Miễn phí ship từ 100k</span>
          <span className="text-white font-semibold">💳 Hoàn tiền 10%</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
