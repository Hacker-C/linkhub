import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/actions/lib/queryKeys";
import { queryCategories, TreeCategory } from "@/actions/categories";
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

export const useCategoryFromCacheData = (categoryId: string) => {
  const queryClient = useQueryClient()
  const categories = queryClient.getQueryData(queryKeys.queryCategories()) as TreeCategory[]
  if (!categories) {
    return { category: undefined }
  }
  console.log('categories')
  console.log(categories)
  const category = categories?.find(category => category.id === categoryId) || undefined
  return {
    category: category
  }
}
