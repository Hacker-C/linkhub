import { useParams } from "next/navigation";

export const usePageParams = (key: 'categoryid') => {
  const params = useParams()
  return  params[key] as string
}


