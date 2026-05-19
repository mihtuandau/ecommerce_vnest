import React from "react";

export default function TermsOfServicePage() {
  return (
    <div className="max-w-[1000px] mx-auto py-12 md:py-20 px-4 sm:px-6">
      <header className="mb-12 border-b border-slate-100 pb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Điều khoản dịch vụ</h1>
        <p className="text-slate-500 text-sm">Quy định và thỏa thuận sử dụng dịch vụ tại LUXE</p>
      </header>

      <div className="space-y-10 text-slate-700 leading-relaxed text-base font-normal">
        <section>
          <h2 className="font-bold text-slate-900 mb-3">01. Chấp thuận các điều khoản</h2>
          <p>
            Bằng việc truy cập và sử dụng website LUXE, quý khách đồng ý tuân thủ các điều khoản và điều kiện được quy định tại đây. Nếu không đồng ý với bất kỳ phần nào, vui lòng ngừng sử dụng dịch vụ của chúng tôi.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-slate-900 mb-3">02. Quyền và trách nhiệm của khách hàng</h2>
          <p>
            Khách hàng cam kết cung cấp thông tin chính xác khi đăng ký và mua hàng. Khách hàng có trách nhiệm bảo mật thông tin tài khoản và chịu trách nhiệm về mọi hoạt động diễn ra dưới tên tài khoản của mình.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-slate-900 mb-3">03. Sở hữu trí tuệ</h2>
          <p>
            Toàn bộ nội dung trên website bao gồm văn bản, hình ảnh, logo, thiết kế đều thuộc sở hữu của LUXE hoặc các bên cấp phép liên quan. Mọi hành vi sao chép, sử dụng khi chưa được sự đồng ý bằng văn bản đều bị nghiêm cấm.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-slate-900 mb-3">04. Giới hạn trách nhiệm</h2>
          <p>
            LUXE không chịu trách nhiệm đối với bất kỳ thiệt hại trực tiếp hoặc gián tiếp nào phát sinh từ việc sử dụng website hoặc do sản phẩm bị sử dụng sai mục đích, sai hướng dẫn của nhà sản xuất.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-slate-900 mb-3">05. Thay đổi điều khoản</h2>
          <p>
            Chúng tôi có quyền cập nhật, sửa đổi các điều khoản này bất kỳ lúc nào mà không cần thông báo trước. Các thay đổi sẽ có hiệu lực ngay khi được đăng tải trên website.
          </p>
        </section>
      </div>
    </div>
  );
}
