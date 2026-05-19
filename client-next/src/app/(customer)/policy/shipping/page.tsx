import React from "react";

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-[1000px] mx-auto py-12 md:py-20 px-4 sm:px-6">
      <header className="mb-12 border-b border-slate-100 pb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Chính sách vận chuyển
        </h1>
        <p className="text-slate-500 text-sm">Áp dụng cho tất cả đơn hàng tại LUXE</p>
      </header>

      <div className="space-y-10 text-slate-700 leading-relaxed text-base font-normal">
        <section>
          <h2 className="font-bold text-slate-900 mb-3">
            01. Phạm vi và đối tác vận chuyển
          </h2>
          <p>
            Chúng tôi thực hiện giao hàng trên toàn lãnh thổ Việt Nam (63 tỉnh thành).
            LUXE hợp tác cùng các đơn vị vận chuyển uy tín như Giao hàng nhanh (GHN),
            Giao hàng tiết kiệm (GHTK) và Viettel Post để đảm bảo hàng hóa đến tay khách
            hàng an toàn.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-slate-900 mb-3">
            02. Thời gian giao hàng dự kiến
          </h2>
          <p className="mb-3">
            Thời gian giao hàng được tính từ thời điểm đơn hàng được xác nhận thành
            công:
          </p>
          <ul className="list-none space-y-2">
            <li>• Khu vực nội thành (Hà Nội, TP.HCM): 1 - 2 ngày làm việc.</li>
            <li>• Khu vực tỉnh thành khác: 2 - 4 ngày làm việc.</li>
            <li>• Khu vực vùng sâu, vùng xa, hải đảo: 3 - 7 ngày làm việc.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-slate-900 mb-3">03. Cước phí vận chuyển</h2>
          <p>
            Cước phí vận chuyển được tính dựa trên trọng lượng thực tế và kích thước quy
            đổi của kiện hàng. Chúng tôi miễn phí vận chuyển cho các đơn hàng có giá trị
            từ 1.000.000đ trở lên. Đối với đơn hàng dưới mức này, phí vận chuyển sẽ được
            hệ thống tự động tính toán và hiển thị tại trang thanh toán.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-slate-900 mb-3">
            04. Chính sách kiểm hàng (Đồng kiểm)
          </h2>
          <p>
            Khi nhận hàng, quý khách được quyền mở gói hàng để kiểm tra ngoại quan sản
            phẩm (số lượng, màu sắc, tình trạng nguyên vẹn). Việc đồng kiểm không bao
            gồm việc dùng thử hoặc kích hoạt sản phẩm điện tử. Nếu có bất kỳ sai sót
            nào, quý khách vui lòng từ chối nhận hàng và báo ngay cho bộ phận CSKH.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-slate-900 mb-3">
            05. Nghĩa vụ của bên vận chuyển
          </h2>
          <p>
            Đơn vị vận chuyển có trách nhiệm bảo quản hàng hóa nguyên vẹn trong suốt quá
            trình di chuyển. Trong trường hợp hàng hóa bị thất lạc hoặc hư hỏng do lỗi
            vận chuyển, chúng tôi cam kết sẽ phối hợp cùng đối tác để bồi thường hoặc
            gửi lại sản phẩm mới cho khách hàng.
          </p>
        </section>
      </div>
    </div>
  );
}
