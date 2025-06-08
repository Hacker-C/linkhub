"use client";
import React from 'react';
import { BookmarkCard } from './BookmarkCard';
import { cn } from '@/lib/utils';
import { Loader } from "lucide-react";
import { useBookmarkList } from "@/hooks/useBookmarkList";

interface BookmarkListProps {
  layout: 'grid' | 'list';
  isPublicQuery?: boolean
}

export function BookmarkList({ layout, isPublicQuery = false }: BookmarkListProps) {
  const { isLoading, queryResult } = useBookmarkList(isPublicQuery)
  const bookmarks = queryResult?.data || []

  if (isLoading) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <Loader className="animate-spin mx-auto"/>
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
        <BookmarkCard key={bookmark.id} bookmark={bookmark} isListView={layout === 'list'}/>
      ))}
    </div>
  );
}