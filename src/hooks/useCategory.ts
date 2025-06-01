import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/actions/lib/queryKeys";
import { queryCategory } from "@/actions/categories";
import { toast } from "sonner";

export const useCategory = (id: string) => {
  const { isLoading, data: queryResult } = useQuery({
    queryKey: queryKeys.queryCategoryId(id),
    queryFn: () => queryCategory(id),
  })

  if (queryResult?.errorMessage) {
    toast(queryResult.errorMessage);
    return {
      isLoading:  false,
    }
  }

  return {
    isLoading,
    category: queryResult?.data
  }
}
