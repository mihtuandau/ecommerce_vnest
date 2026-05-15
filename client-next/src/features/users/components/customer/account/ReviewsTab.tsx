"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Star, Package, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useMyReviews } from "@/features/reviews/hooks";
import { useRouter } from "next/navigation";

export function ReviewsTab() {
  const router = useRouter();
  const { data: reviewsData, isLoading: isLoadingReviews } = useMyReviews({ 
    limit: 50 
  });

  const reviews = React.useMemo(() => {
    const body = reviewsData as any;
    if (!body) return [];
    if (Array.isArray(body)) return body;
    
    const possibleList = body.reviews || body.data || body.items || [];
    if (Array.isArray(possibleList)) return possibleList;
    
    if (typeof possibleList === 'object' && possibleList !== null) {
      const nestedList = possibleList.reviews || possibleList.data || possibleList.items || [];
      if (Array.isArray(nestedList)) return nestedList;
    }
    
    return [];
  }, [reviewsData]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white border border-brand-sand rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(61,43,26,0.03)]">
        <div className="px-6 py-5 border-b border-brand-sand/50">
          <h2 className="text-base font-bold text-brand-espresso flex items-center gap-2.5">
            <MessageCircle size={18} className="text-brand-bronze" /> Đánh giá của tôi
          </h2>
        </div>
        
        <div className="p-6 lg:p-8">
          {isLoadingReviews ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-2xl" />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-brand-ivory rounded-full flex items-center justify-center mx-auto opacity-50">
                <Star size={32} className="text-brand-taupe" />
              </div>
              <h3 className="text-lg font-bold text-brand-espresso font-serif">Bạn chưa có đánh giá nào</h3>
              <p className="text-sm text-brand-taupe max-w-sm mx-auto">Mua sắm và chia sẻ trải nghiệm của bạn để nhận thêm điểm thưởng tích lũy!</p>
              <Button onClick={() => router.push("/shop")} className="rounded-full h-10 px-8 text-[12px] font-bold bg-brand-espresso text-white transition-all hover:scale-105 active:scale-95">Đi đến cửa hàng</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {reviews.map((review: any) => (
                <div key={review.id} className="bg-brand-cream/10 border border-brand-sand rounded-2xl p-6 transition-all hover:border-brand-taupe shadow-sm group">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-white border border-brand-sand overflow-hidden shrink-0 shadow-sm">
                        {review.product?.images?.[0] ? (
                          <div className="relative w-full h-full">
                            <Image 
                              src={typeof review.product.images[0] === 'string' ? review.product.images[0] : review.product.images[0].url} 
                              alt={review.product.name} 
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="w-full h-full bg-brand-ivory flex items-center justify-center text-brand-taupe">
                            <Package size={20} />
                          </div>
                        )}
                      </div>
                      <div>
                        <Link 
                          href={`/product/${review.product?.slug}`}
                          className="text-sm font-bold text-brand-espresso hover:text-brand-bronze transition-colors flex items-center gap-1.5"
                        >
                          {review.product?.name || "Sản phẩm đã xóa"}
                          <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "text-amber-400" : "text-brand-sand"} />
                            ))}
                          </div>
                          <span className="text-[11px] text-brand-taupe font-medium">{new Date(review.createdAt).toLocaleDateString("vi-VN")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/50 rounded-xl p-4 border border-brand-sand/50">
                    <p className="text-sm text-brand-espresso leading-relaxed italic">"{review.comment}"</p>
                  </div>

                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2 no-scrollbar">
                      {review.images.map((img: any, idx: number) => (
                        <div key={img.id || idx} className="relative h-16 w-16 flex-shrink-0 group cursor-zoom-in">
                          <Image 
                            src={img.url} 
                            alt="Review" 
                            fill
                            className="object-cover rounded-lg border border-brand-sand shadow-sm group-hover:scale-105 transition-transform" 
                            unoptimized
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
