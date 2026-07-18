"use client";

import type { Review } from "@/types/models";
import { SectionHeading } from "@/features/home/components/customer/shared/SectionHeading";

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

function ReviewStars({
  rating = 5,
  size = "sm",
}: {
  rating?: number;
  size?: "sm" | "lg";
}) {
  const safeRating = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <div
      className={`text-brand-accent tracking-[2px] mb-4 ${
        size === "lg" ? "text-lg" : "text-sm"
      }`}
    >
      {"★".repeat(safeRating)}
      {"☆".repeat(5 - safeRating)}
    </div>
  );
}

function Attribution({
  initial,
  name,
  meta,
}: {
  initial: string;
  name: string;
  meta: string;
}) {
  return (
    <div className="flex items-center gap-3 mt-6 pt-4 border-t border-brand-ivory">
      <div className="w-10 h-10 rounded-full bg-brand-ivory flex items-center justify-center text-brand-espresso text-[12px] font-semibold shrink-0">
        {initial}
      </div>
      <div>
        <h4 className="text-[13px] font-bold text-brand-espresso line-clamp-1">
          {name}
        </h4>
        <p className="text-[11px] text-brand-taupe line-clamp-1">{meta}</p>
      </div>
    </div>
  );
}

function FeaturedReview({
  quote,
  initial,
  name,
  meta,
  rating,
}: {
  quote: string;
  initial: string;
  name: string;
  meta: string;
  rating?: number;
}) {
  return (
    <div className="bg-white border border-brand-sand rounded-2xl p-8 md:p-10 flex flex-col justify-between h-full">
      <div>
        <ReviewStars rating={rating} size="lg" />
        <p className="font-serif text-[20px] md:text-[24px] text-brand-espresso leading-snug">
          &quot;{quote}&quot;
        </p>
      </div>
      <Attribution initial={initial} name={name} meta={meta} />
    </div>
  );
}

function CompactReview({
  quote,
  initial,
  name,
  meta,
  rating,
}: {
  quote: string;
  initial: string;
  name: string;
  meta: string;
  rating?: number;
}) {
  return (
    <div className="bg-white border border-brand-sand rounded-2xl p-6 flex flex-col justify-between h-full">
      <div>
        <ReviewStars rating={rating} />
        <p className="text-[13.5px] text-brand-espresso leading-relaxed italic line-clamp-4">
          &quot;{quote}&quot;
        </p>
      </div>
      <Attribution initial={initial} name={name} meta={meta} />
    </div>
  );
}

export function HomeReviewsSection({ reviews = [] }: HomeReviewsSectionProps) {
  const source =
    reviews.length > 0
      ? reviews.slice(0, 3).map((review, i) => ({
          key: review.id || i,
          quote: review.comment || review.content || "",
          initial: (review.user?.name || review.user?.fullName || "K")
            .charAt(0)
            .toUpperCase(),
          name: review.user?.name || review.user?.fullName || "Khách hàng",
          meta: review.user?.address || "Đã mua hàng tại LUXE",
          rating: review.rating,
        }))
      : FALLBACK_REVIEWS.map((r) => ({
          key: r.initials,
          quote: r.text,
          initial: r.initials,
          name: r.name,
          meta: r.role,
          rating: 5,
        }));

  const [featured, ...rest] = source;

  return (
    <section className="w-full mt-12 pb-24">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 space-y-10">
        <SectionHeading
          index={6}
          eyebrow="Đánh giá"
          title="Khách hàng nói gì"
          accent="nói gì"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featured && (
            <FeaturedReview
              quote={featured.quote}
              initial={featured.initial}
              name={featured.name}
              meta={featured.meta}
              rating={featured.rating}
            />
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6">
            {rest.map((review) => (
              <CompactReview
                key={review.key}
                quote={review.quote}
                initial={review.initial}
                name={review.name}
                meta={review.meta}
                rating={review.rating}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
