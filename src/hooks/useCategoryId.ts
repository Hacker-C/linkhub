import { useParams } from "next/navigation";

export const usePageParams = (key: string) => {
  const params = useParams()
  return  params[key] as string
}


