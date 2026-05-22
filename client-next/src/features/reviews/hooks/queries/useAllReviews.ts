import { useQuery } from "@tanstack/react-query";
import { reviewsApi } from "@/features/reviews/api/index";
import type { ReviewsQueryParams } from "@/features/reviews/types";

export const useAllReviews = (params: ReviewsQueryParams) => {
  return useQuery({
    queryKey: ["reviews", "all", params],
    queryFn: () => reviewsApi.getAllReviews(params),
  });
};
