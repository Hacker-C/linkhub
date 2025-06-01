import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/actions/lib/queryKeys";
import { queryBookmarks } from "@/actions/bookmarks";
import { useParams } from "next/navigation";
import { CATEGORY_DEFAULT_ID } from "@/lib/constants";

export const useBookmarkList = () => {
  const params = useParams()
  const categoryId = params.categoryid as string;

  const queryDBCategoryId = (categoryId === CATEGORY_DEFAULT_ID || !categoryId) ? null : categoryId
  const { isLoading, data: queryResult, refetch } = useQuery({
    queryKey: queryKeys.queryBookmarksByCategoryId(queryDBCategoryId as string),
    queryFn: () => queryBookmarks({ categoryId: queryDBCategoryId }),
  })

  const queryClient = useQueryClient()

  const invalidateBookmarkList = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.queryBookmarksByCategoryId(queryDBCategoryId as string),
    })
  }

  return {
    isLoading,
    queryResult,
    refetch,
    invalidateBookmarkList
  }
}
