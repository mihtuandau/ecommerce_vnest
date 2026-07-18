"use client";

import type { Review } from "@/types/models";

type HomeReview = Review & {
  content?: string;
  user?: Review["user"] & {
    fullName?: string;
    address?: string;
  };
};

const FALLBACK_REVIEWS = [
  {
    text: "Chất lượng sản phẩm thực sự vượt mong đợi. Giao hàng nhanh, đóng gói đẹp. Mình đã mua lần thứ 5 và lần nào cũng hài lòng.",
    name: "Linh Nguyễn",
    role: "Khách hàng thân thiết · Hà Nội",
    initials: "LN",
  },
  {
    text: "Mình mua chiếc đầm lụa cho tiệc cưới. Vải mềm mịn, form dáng chuẩn như hình. Được nhiều người khen lắm. Sẽ ủng hộ shop dài dài!",
    name: "Minh Tâm",
    role: "Verified · TP. Hồ Chí Minh",
    initials: "MT",
  },
  {
    text: "Túi xách đẹp hơn ảnh, da mềm, khóa chắc. Giao hàng đúng hẹn dù order vào dịp sale. Dịch vụ CSKH nhiệt tình, hỗ trợ đổi size nhanh.",
    name: "Hải Phong",
    role: "Verified · Đà Nẵng",
    initials: "HP",
  },
];

interface HomeReviewsSectionProps {
  reviews?: HomeReview[];
}

function ReviewStars({ rating = 5 }: { rating?: number }) {
  const safeRating = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <div className="text-brand-accent text-sm tracking-[2px] mb-4">
      {"★".repeat(safeRating)}
      {"☆".repeat(5 - safeRating)}
    </div>
  );
}

function ReviewCard({ review }: { review: HomeReview }) {
  const userName = review.user?.name || review.user?.fullName || "Khách hàng";
  const initial = userName.charAt(0).toUpperCase();

  return (
    <div className="bg-white border border-brand-sand rounded-2xl p-8 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div>
        <ReviewStars rating={review.rating} />
        <p className="text-[13.5px] text-brand-espresso leading-relaxed italic line-clamp-4">
          &quot;{review.comment || review.content}&quot;
        </p>
      </div>

      <div className="flex items-center gap-3 mt-6 pt-4 border-t border-brand-ivory">
        <div className="w-10 h-10 rounded-full bg-brand-ivory flex items-center justify-center text-[#8B6F47] text-[12px] font-semibold shrink-0">
          {initial}
        </div>
        <div>
          <h4 className="text-[13px] font-bold text-brand-espresso line-clamp-1">
            {userName}
          </h4>
          <p className="text-[11px] text-brand-taupe line-clamp-1">
            {review.user?.address || "Đã mua hàng tại LUXE"}
          </p>
        </div>
      </div>
    </div>
  );
}

function FallbackReviewCard({
  review,
}: {
  review: (typeof FALLBACK_REVIEWS)[number];
}) {
  return (
    <div className="bg-white border border-brand-sand rounded-2xl p-8 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div>
        <ReviewStars />
        <p className="text-[13.5px] text-brand-espresso leading-relaxed italic line-clamp-4">
          &quot;{review.text}&quot;
        </p>
      </div>

      <div className="flex items-center gap-3 mt-6 pt-4 border-t border-brand-ivory">
        <div className="w-10 h-10 rounded-full bg-brand-ivory flex items-center justify-center text-[#8B6F47] text-[12px] font-semibold shrink-0">
          {review.initials}
        </div>
        <div>
          <h4 className="text-[13px] font-bold text-brand-espresso line-clamp-1">
            {review.name}
          </h4>
          <p className="text-[11px] text-brand-taupe line-clamp-1">
            {review.role}
          </p>
        </div>
      </div>
    </div>
  );
}

export function HomeReviewsSection({ reviews = [] }: HomeReviewsSectionProps) {
  const visibleReviews = reviews.slice(0, 3);

  return (
    <section className="w-full mt-12 pb-24">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <h2 className="text-[28px] md:text-[32px] text-brand-espresso font-serif font-semibold mb-8">
          Khách hàng{" "}
          <em className="text-brand-accent" style={{ fontStyle: "italic" }}>
            nói gì
          </em>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleReviews.length > 0
            ? visibleReviews.map((review, index) => (
                <ReviewCard key={review.id || index} review={review} />
              ))
            : FALLBACK_REVIEWS.map((review) => (
                <FallbackReviewCard key={review.initials} review={review} />
              ))}
        </div>
      </div>
    </section>
  );
}
