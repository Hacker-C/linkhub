'use client'

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { usePageParams } from "@/hooks/usePageParams";

export default function PublicCollectionPage() {
  const router = useRouter()
  const username = usePageParams('username')
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Public Link Collections of {username}</h1>
      <p className="text-lg text-gray-500 my-4">TODO Page</p>
      <Button onClick={() => router.back()}>Go Back</Button>
    </div>
  )
}
