import React from "react";

export default function ReturnPolicyPage() {
  return (
    <div className="max-w-[1000px] mx-auto py-12 md:py-20 px-4 sm:px-6">
      <header className="mb-12 border-b border-slate-100 pb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Chính sách đổi trả & hoàn tiền</h1>
        <p className="text-slate-500 text-sm">Quy định chi tiết về việc trả hàng và hoàn tiền tại LUXE</p>
      </header>

      <div className="space-y-10 text-slate-700 leading-relaxed text-base font-normal">
        <section>
          <h2 className="font-bold text-slate-900 mb-3">01. Điều kiện trả hàng, hoàn tiền</h2>
          <p className="mb-3">Chúng tôi chấp nhận yêu cầu trả hàng và hoàn tiền trong các trường hợp sau:</p>
          <ul className="list-none space-y-2">
            <li>• Sản phẩm bị lỗi kỹ thuật do nhà sản xuất.</li>
            <li>• Sản phẩm bị hư hỏng, bể vỡ do quá trình vận chuyển.</li>
            <li>• Sản phẩm giao không đúng mẫu mã, số lượng so với đơn đặt hàng.</li>
            <li>• Sản phẩm là hàng giả, hàng nhái, không đúng cam kết.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-slate-900 mb-3">02. Thời hạn yêu cầu đổi trả</h2>
          <p>
            Khách hàng cần gửi yêu cầu đổi trả trong vòng <strong>30 ngày</strong> kể từ ngày nhận hàng thành công. Sau thời gian này, các yêu cầu đổi trả sẽ không được chấp nhận, khách hàng sẽ được chuyển sang chế độ bảo hành sản phẩm (nếu có).
          </p>
        </section>

        <section>
          <h2 className="font-bold text-slate-900 mb-3">03. Tình trạng sản phẩm đổi trả</h2>
          <p className="mb-3">Sản phẩm đổi trả phải đảm bảo các điều kiện sau:</p>
          <ul className="list-none space-y-2">
            <li>• Còn đầy đủ hóa đơn mua hàng hoặc bằng chứng giao dịch.</li>
            <li>• Còn nguyên tem niêm phong, nhãn mác của nhà cung cấp.</li>
            <li>• Sản phẩm chưa qua sử dụng, không có dấu hiệu trầy xước hoặc can thiệp kỹ thuật.</li>
            <li>• Đầy đủ các phụ kiện, quà tặng kèm theo (nếu có).</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-slate-900 mb-3">04. Thời gian và phương thức hoàn tiền</h2>
          <p className="mb-3">
            Chúng tôi sẽ tiến hành hoàn tiền sau khi nhận được sản phẩm trả về và kiểm tra tình trạng hàng hóa thành công. Thời gian hoàn tiền cụ thể:
          </p>
          <ul className="list-none space-y-2">
            <li>• Hoàn qua tài khoản ngân hàng: 3 - 5 ngày làm việc.</li>
            <li>• Hoàn qua thẻ tín dụng/ghi nợ: 7 - 15 ngày làm việc (tùy ngân hàng).</li>
            <li>• Phí vận chuyển hoàn trả: Sẽ do Shop chi trả nếu lỗi thuộc về nhà bán hàng.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-slate-900 mb-3">05. Quy trình xử lý khiếu nại</h2>
          <p>
            Quý khách vui lòng liên hệ hotline 1900 8888 hoặc gửi email về support@luxe.vn để được hướng dẫn. Mọi khiếu nại sẽ được tiếp nhận và xử lý trong vòng 24 giờ làm việc.
          </p>
        </section>
      </div>
    </div>
  );
}
