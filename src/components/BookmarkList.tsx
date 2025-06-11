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

import { Button } from "@/components/ui/button"; // Import Button component

export function BookmarkList({ layout, isPublicQuery = false }: BookmarkListProps) {
  const {
    isLoading, // Initial load
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useBookmarkList(isPublicQuery);

  const bookmarks = data?.pages.flatMap(page => page?.data || []) || [];

  if (isLoading) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <Loader className="animate-spin mx-auto"/>
      </div>
    )
  }

  if (!isLoading && bookmarks.length === 0) {
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

      {hasNextPage && (
        <div className="text-center mt-6">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="outline"
          >
            {isFetchingNextPage ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Loading more...
              </>
            ) : 'Load More'}
          </Button>
        </div>
      )}

      {!hasNextPage && bookmarks.length > 0 && !isLoading && (
         <div className="text-center py-10 text-muted-foreground">
           <p>No more bookmarks to load.</p>
         </div>
      )}
    </>
  );
}