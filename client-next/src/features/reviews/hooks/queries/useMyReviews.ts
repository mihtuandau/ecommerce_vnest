import { useQuery } from "@tanstack/react-query";
import { reviewsApi } from "@/features/reviews/api/index";
import type { MyReviewsQueryParams } from "@/features/reviews/types";

export const useMyReviews = (params: MyReviewsQueryParams = {}) => {
  return useQuery({
    queryKey: ["reviews", "my", params],
    queryFn: () => reviewsApi.getMyReviews(params),
  });
};
