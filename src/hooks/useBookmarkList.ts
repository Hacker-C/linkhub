import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/actions/lib/queryKeys";
import { queryBookmarks } from "@/actions/bookmarks";
import { useParams } from "next/navigation";
import { CATEGORY_DEFAULT_ID, OPERATIONS } from "@/lib/constants";
import { ResponseWithError } from "@/lib/utils";
import { Bookmark } from "@prisma/client";

/**
 * Operate Bookmark cache data
 * @param queryClient
 */
const operateBookmarkCacheData = (queryClient : QueryClient) => (
  categoryId: string,
  targetBookmark: ResponseWithError<Bookmark>,
  op: OPERATIONS
) => {
  // query cache data
  if (op === 'query') {
    // const categories = queryClient.getQueryData(queryKeys.queryCategories()) as TreeCategory[]
    return queryClient.getQueryData(queryKeys.queryBookmarksByCategoryId(categoryId))
  }
  // update，add，or delete cache data
  queryClient.setQueryData(queryKeys.queryBookmarksByCategoryId(categoryId), (oldData: ResponseWithError<Bookmark[]>) => {
    if (!oldData || !targetBookmark.data) return oldData
    const oldList = oldData?.data || []
    const targetBookmarkDB = targetBookmark.data
    const { id : targetId } = targetBookmarkDB
    switch (op) {
      case 'update': {
        return {
          data: oldList.map((bookmark) =>
            bookmark.id === targetId ? { ...bookmark, ...(targetBookmarkDB || {}) } : bookmark
          ),
          errMessage: null
        }
      }
      case 'add': {
        return {
          data: [targetBookmarkDB, ...oldList],
          errMessage: null
        }
      }
      case 'delete': {
        return {
          data: oldList.filter(bookmark => bookmark.id !== targetId),
          errMessage: null
        }
      }
    }
  })
}

/**
 * useBookmarkList
 */
export const useBookmarkList = () => {
  const params = useParams()
  const categoryId = params.categoryid as string
  const queryClient = useQueryClient()

  const queryDBCategoryId = (categoryId === CATEGORY_DEFAULT_ID || !categoryId) ? null : categoryId
  const { isLoading, data: queryResult, refetch } = useQuery({
    queryKey: queryKeys.queryBookmarksByCategoryId(queryDBCategoryId as string),
    queryFn: () => queryBookmarks({ categoryId: queryDBCategoryId }),
  })

  // invalidate data
  const invalidateBookmarkList = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.queryBookmarksByCategoryId(queryDBCategoryId as string),
    })
  }

  // do some operations on cache data
  const doOperateOnBookmarkCacheData = operateBookmarkCacheData(queryClient)

  return {
    isLoading,
    queryResult,
    refetch,
    invalidateBookmarkList,
    doOperateOnBookmarkCacheData
  }
}
