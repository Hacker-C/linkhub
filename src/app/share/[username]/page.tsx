'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound, useRouter } from "next/navigation";
import { usePageParams } from "@/hooks/usePageParams";
import { queryPublicCategoriesOfUser } from "@/actions/categories";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/actions/lib/queryKeys";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function PublicCollectionPage() {
  const router = useRouter();
  const username = usePageParams('username');

  const { data: result, error, isLoading } = useQuery({
    queryKey: queryKeys.queryPublicCategoriesOfUser(username),
    queryFn: () => queryPublicCategoriesOfUser(username),
  });

  console.log('PublicCollectionPage result:', result);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-primary dark:text-primary-400" />
        <p className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-300">Loading collections...</p>
      </div>
    );
  }

  if (!result || error || result?.errorMessage) {
    notFound();
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-lg border-none bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-semibold text-gray-900 dark:text-gray-100 pt-6">
              Public Link Collections of <Link href="/" className="hover:underline">LinkHub</Link>/{username}
            </CardTitle>
            <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">Explore shared collections</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {result.data && result.data.length > 0 ? (
              <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800 pr-2">
                <ul className="space-y-3">
                  {result.data.map((category) => (
                    <li
                      key={category.id}
                      className="text-lg text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors p-2 cursor-pointer"
                      onClick={() => router.push(`/share/${username}/${category.shortId}`)}
                    >
                      {category.name}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 text-base">
                No public collections found for this user.
              </p>
            )}
          </CardContent>
        </Card>
        <footer className="mt-6 text-center text-md text-gray-500 dark:text-gray-400 absolute bottom-4 w-full">
          &copy; {new Date().getFullYear()} <Link href='https://github.com/Hacker-C/linkhub' className='underline' target='_blank'>LinkHub</Link>. All rights reserved.
        </footer>
      </div>
    </>
  );
}