import React from "react";

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto py-10 md:py-16 px-4 sm:px-6">
      <header className="mb-12 border-b border-slate-100 pb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Thông tin liên hệ</h1>
        <p className="text-slate-500 text-sm">Chúng tôi luôn sẵn sàng hỗ trợ quý khách</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-10">
          <section>
            <h2 className="font-bold text-slate-900 mb-4">01. Trụ sở chính</h2>
            <p className="text-slate-700">Tầng 5, Tòa nhà TechHub, Số 123 Cầu Giấy, Hà Nội.</p>
          </section>

          <section>
            <h2 className="font-bold text-slate-900 mb-4">02. Tổng đài hỗ trợ</h2>
            <p className="text-slate-700">Hotline: 1900 8888 (08:00 - 22:00 hàng ngày)</p>
          </section>

          <section>
            <h2 className="font-bold text-slate-900 mb-4">03. Email liên hệ</h2>
            <p className="text-slate-700">Bộ phận CSKH: support@luxe.vn</p>
            <p className="text-slate-700">Hợp tác kinh doanh: partnership@luxe.vn</p>
          </section>
        </div>

        <div>
          <h2 className="font-bold text-slate-900 mb-6">Gửi yêu cầu trực tuyến</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Họ và tên</label>
              <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Số điện thoại</label>
              <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Nội dung</label>
              <textarea rows={4} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400"></textarea>
            </div>
            <button type="button" className="px-6 py-2 bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-slate-800 transition-colors">
              Gửi tin nhắn
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
