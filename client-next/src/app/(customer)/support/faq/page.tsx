import React from "react";

const FAQS = [
  {
    category: "Đơn hàng & Thanh toán",
    items: [
      {
        q: "Làm thế nào để tôi đặt hàng tại LUXE?",
        a: "Bạn chỉ cần chọn sản phẩm, thêm vào giỏ hàng và thực hiện các bước thanh toán theo hướng dẫn trên website. Sau khi đặt hàng thành công, chúng tôi sẽ gửi email xác nhận cho bạn.",
      },
      {
        q: "Shop hỗ trợ những phương thức thanh toán nào?",
        a: "Chúng tôi hỗ trợ thanh toán qua chuyển khoản ngân hàng, thanh toán khi nhận hàng (COD) và các loại thẻ tín dụng/ghi nợ quốc tế.",
      },
    ],
  },
  {
    category: "Vận chuyển & Giao hàng",
    items: [
      {
        q: "Tôi có thể theo dõi đơn hàng của mình không?",
        a: "Có, ngay sau khi hàng được gửi đi, mã vận đơn sẽ được cập nhật trong phần Lịch sử đơn hàng của bạn để bạn có thể theo dõi trực tiếp.",
      },
      {
        q: "Thời gian giao hàng mất bao lâu?",
        a: "Thông thường từ 1-2 ngày đối với khu vực nội thành và 2-4 ngày đối với các tỉnh thành khác.",
      },
    ],
  },
  {
    category: "Chính sách đổi trả",
    items: [
      {
        q: "Sản phẩm bị lỗi tôi phải làm thế nào?",
        a: "Hãy liên hệ ngay hotline 1900 8888 trong vòng 30 ngày kể từ khi nhận hàng. Chúng tôi sẽ hướng dẫn bạn quy trình đổi mới sản phẩm miễn phí.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-[1000px] mx-auto py-12 md:py-20 px-4 sm:px-6">
      <header className="mb-12 border-b border-brand-sand/50 pb-8">
        <h1 className="text-2xl font-bold text-brand-espresso mb-2">Câu hỏi thường gặp</h1>
        <p className="text-brand-taupe text-sm">
          Giải đáp các thắc mắc phổ biến của khách hàng
        </p>
      </header>

      <div className="space-y-12">
        {FAQS.map((cat, idx) => (
          <section key={idx}>
            <h2 className="text-lg font-bold text-brand-espresso mb-6 uppercase tracking-wider">
              0{idx + 1}. {cat.category}
            </h2>
            <div className="space-y-8">
              {cat.items.map((item, i) => (
                <div key={i}>
                  <p className="font-bold text-brand-espresso mb-2">Q: {item.q}</p>
                  <p className="text-brand-taupe pl-4 border-l-2 border-brand-sand/50 italic font-normal">
                    A: {item.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-20 pt-10 border-t border-brand-sand/50">
        <p className="text-brand-taupe text-sm italic">
          Nếu bạn không tìm thấy câu trả lời cho vấn đề của mình, vui lòng liên hệ
          hotline 1900 8888 hoặc gửi email về support@luxe.vn để được hỗ trợ trực tiếp.
        </p>
      </div>
    </div>
  );
}

