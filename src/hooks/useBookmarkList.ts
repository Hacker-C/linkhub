import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/actions/lib/queryKeys";
import { queryBookmarks } from "@/actions/bookmarks";
import { useParams } from "next/navigation";

export const useBookmarkList = () => {
  const params = useParams()
  const categoryId = params.categoryid as string;

  const queryDBCategoryId = (categoryId === '0' || !categoryId) ? null : categoryId
  console.log('queryDBCategoryId=', queryDBCategoryId);
  const { isLoading, data: queryResult, refetch } = useQuery({
    queryKey: queryKeys.queryBookmarks(),
    queryFn: () => queryBookmarks({ categoryId: queryDBCategoryId })
  })

  return {
    isLoading,
    queryResult,
    refetch
  }
}
