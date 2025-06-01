'use client'

import { usePageParams } from "@/hooks/usePageParams";

export default function Page() {
  const username = usePageParams('username')
  const categoryid = usePageParams('categoryid')
  return <h1>PublicSharePage from {username} / {categoryid}</h1>
}
