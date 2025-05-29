"use client";
import React from 'react';
import { BookmarkCard } from './BookmarkCard';
import { cn } from '@/lib/utils';
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/actions/lib/queryKeys";
import { Loader } from "lucide-react";
import { queryBookmarks } from "@/actions/bookmarks";

interface BookmarkListProps {
  layout: 'grid' | 'list';
}

export function BookmarkList({ layout }: BookmarkListProps) {

  const params = useParams()
  const categoryId = params.categoryid as string;

  const { isLoading, data: queryResult } = useQuery({
    queryKey: queryKeys.queryBookmarks(),
    queryFn: () => queryBookmarks({ categoryId })
  })

  const bookmarks = queryResult?.data || []

  if (isLoading) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <Loader className="animate-spin mx-auto" />
      </div>
    )
  }

  if (!bookmarks || bookmarks.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>You don&#39;t have any bookmarks yet.</p>
        <p>Add some of your favorite sites to get started!</p>
      </div>
    )
  }

  return (
    <div
      id="bookmark-list-container"
      className={cn(
        layout === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'layout-list'
      )}
    >
      {bookmarks.map(bookmark => (
        <BookmarkCard key={bookmark.id} bookmark={bookmark} isListView={layout === 'list'} />
      ))}
    </div>
  );
}