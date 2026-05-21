import { useQuery } from "@tanstack/react-query";
import { reviewsApi } from "@/features/reviews/api/index";

export const useLatestReviews = () => {
  return useQuery({
    queryKey: ["reviews", "latest"],
    queryFn: () => reviewsApi.getLatestReviews(),
  });
};
