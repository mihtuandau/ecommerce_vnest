import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const ProductAccordion = ({ product }) => {
  const [openAccordion, setOpenAccordion] = useState("description");

  const toggleAccordion = (section) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  const accordionItems = [
    {
      key: "description",
      title: "Mô tả sản phẩm",
      content: product.description || "Không có mô tả chi tiết.",
    },
    {
      key: "terms",
      title: "Chính sách & Điều khoản",
      content:
        "Áp dụng các điều khoản tiêu chuẩn của cửa hàng. Liên hệ để biết thêm chi tiết.",
    },
    {
      key: "ask",
      title: "Hỏi về sản phẩm này",
      content:
        "Có thắc mắc về sản phẩm? Vui lòng liên hệ support@example.com hoặc gọi 1800-123-456",
    },
  ];

  return (
    <div className="mb-12">
      {accordionItems.map((item) => (
        <div key={item.key} className="border-b border-gray-100">
          <button
            onClick={() => toggleAccordion(item.key)}
            className="w-full flex items-center justify-between py-5 text-left group"
          >
            <span className="text-xs uppercase tracking-wide text-gray-500 group-hover:text-gray-900 transition-colors">{item.title}</span>
            <FaChevronDown
              className={`w-3 h-3 text-gray-300 group-hover:text-gray-500 transition-all duration-200 ${
                openAccordion === item.key ? "rotate-180" : ""
              }`}
            />
          </button>
          {openAccordion === item.key && (
            <div className="pb-6 text-sm text-gray-600 leading-relaxed">
              {typeof item.content === "string" ? (
                <p>{item.content}</p>
              ) : (
                item.content
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
export default ProductAccordion;
