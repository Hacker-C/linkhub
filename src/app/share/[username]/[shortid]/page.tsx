'use client'

import { usePageParams } from "@/hooks/usePageParams";
import { TypographyH2 } from "@/components/ui/typography";
import { useQuery } from "@tanstack/react-query";
import { queryCategoryByShortId } from "@/actions/categories";
import { queryKeys } from "@/actions/lib/queryKeys";
import React from "react";
import { ModeToggle } from "@/components/ModeToggle";
import Link from "next/link";
import { BookmarkList } from "@/components/BookmarkList";
import { LayoutSwitcher } from "@/components/LayoutSwitcher";
import useSafeLocalStorage from "@/hooks/useSafeLocalStorage";

export default function Page() {
  const username = usePageParams('username')
  const shortId = +usePageParams('shortid')
  const [layout, setLayout] = useSafeLocalStorage<'grid' | 'list'>('bookmark-list-layout', 'grid')

  const params = { shortId, username }

  const { isLoading, data: result } = useQuery({
    queryKey: queryKeys.queryCategoryId(shortId.toString()),
    queryFn: () => queryCategoryByShortId(params)
  })

  if (isLoading) {
    return <CenterPage>Loading...</CenterPage>
  }

  const { errorMessage, data: category } = result!

  if (errorMessage || !category || !category.isPublic) {
    return <CenterPage> {errorMessage || 'Collection is not found or not public!'}</CenterPage>
  }

  return <>
    <div className="flex flex-col min-h-screen">
      <div className='px-4 sm:px-6 md:px-10 lg:px-16 flex-1'>
        <div className='relative'>
          <TypographyH2 className='text-center py-10 border-0'>
          {category.name} shared by <Link href={`/share/${username}`} className='underline'>LinkHub / {username}</Link>
        </TypographyH2>
        <div className='absolute right-0 top-4'>
          <ModeToggle/>
        </div>
      </div>
      <div className=''>
        <LayoutSwitcher currentLayout={layout} onLayoutChange={setLayout}/>
        <div className='mt-6'>
          <BookmarkList layout={layout} isPublicQuery={true} categoryId={category.id}/>
        </div>
      </div>
    </div>
    <footer className="mt-6 text-center text-md text-gray-500 dark:text-gray-400">
      &copy; {new Date().getFullYear()} <Link href='https://github.com/Hacker-C/linkhub' className='underline'
                                              target='_blank'>LinkHub</Link>. All rights reserved.
    </footer>
    </div>
  </>
}

function CenterPage({ children }: { children: React.ReactNode }) {
  return <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
    <TypographyH2 className='text-center text-2xl py-12 border-hidden'>
      {children}
    </TypographyH2>
  </div>
}
