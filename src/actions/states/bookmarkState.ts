import { ResponseWithError } from "@/lib/utils";
import { Bookmark } from "@/actions/generated/client";
import { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/actions/lib/queryKeys";

export const updateBookmarkCacheData = async (
  categoryId: string,
  updatedBookmark: ResponseWithError<Bookmark>,
  op: 'update' | 'add' | 'delete',
  queryClient: QueryClient
) => {
  // 更新缓存中的文章列表
  queryClient.setQueryData(queryKeys.queryBookmarksByCategoryId(categoryId), (oldData: ResponseWithError<Bookmark[]>) => {
    if (!oldData || !updatedBookmark.data) return oldData
    const oldList = oldData?.data || []
    const updatedBookmarkDb = updatedBookmark.data
    switch (op) {
      case 'update': {
        return {
          data: oldList.map((bookmark) =>
            bookmark?.id === updatedBookmarkDb?.id
              ? { ...bookmark, ...(updatedBookmark?.data || {}) }
              : bookmark
          ),
          errMessage: null
        }
      }
      case 'add': {
        console.log(updatedBookmark)
        return {
          data: [updatedBookmarkDb, ...oldList],
          errMessage: null
        }
      }
      case 'delete': {
        return { data: oldList.filter(bookmark => bookmark.id !== updatedBookmarkDb?.id), errMessage: null }
      }
    }
  })
}