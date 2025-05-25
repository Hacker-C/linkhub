"use client";
import React from 'react';
import { Bookmark } from '@/lib/types';
import { BookmarkCard } from './BookmarkCard';
import { cn } from '@/lib/utils';

interface BookmarkListProps {
  bookmarks: Bookmark[];
  layout: 'grid' | 'list';
}

export function BookmarkList({ bookmarks, layout }: BookmarkListProps) {
  if (!bookmarks || bookmarks.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>这里还没有任何收藏哦。</p>
        <p>尝试添加一些您喜欢的网站吧！</p>
      </div>
    );
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