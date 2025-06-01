import { useParams } from "next/navigation";

type PageParamsKeys = 'categoryid' | 'username'

export const usePageParams = (key: PageParamsKeys) => {
  const params = useParams()
  return  params[key] as string
}
