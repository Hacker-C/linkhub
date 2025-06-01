import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/actions/lib/queryKeys";
import { queryCategories } from "@/actions/categories";
import { toast } from "sonner";

/**
 * Get all categories
 */
export const useCategories = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: queryKeys.queryCategories(),
    queryFn: async () => {
      console.log("Getting categories");
      const res = await queryCategories()
      if (res.errorMessage || !res.data) {
        toast.error(res.errorMessage)
      }
      return res.data
    },
  })

  const queryClient = useQueryClient()
  const invalidateCategories = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.queryCategories(),
    })
  }

  return {
    categories,
    isLoading,
    invalidateCategories
  }
}