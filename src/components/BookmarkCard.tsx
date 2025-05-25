import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // For favicons
import { Bookmark } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Icons } from './icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from '@/components/ui/card'; // Using shadcn Card as base

interface BookmarkCardProps {
  bookmark: Bookmark;
  isListView: boolean;
}

export function BookmarkCard({ bookmark, isListView }: BookmarkCardProps) {
  const FaviconDisplay = () => (
    bookmark.favicon ? (
      <Image
        src={bookmark.favicon}
        alt={`${bookmark.title} Favicon`}
        width={32}
        height={32}
        className={cn("card-favicon rounded-md object-contain", isListView ? "w-6 h-6" : "w-8 h-8")}
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden'); }}
      />
    ) : (
      <div className={cn("card-favicon-placeholder rounded-md bg-muted flex items-center justify-center text-primary font-semibold", isListView ? "w-6 h-6 text-xs" : "w-8 h-8 text-sm")}>
        {bookmark.title.charAt(0).toUpperCase()}
      </div>
    )
  );

  if (isListView) {
    return (
      <div className="bookmark-item"> {/* Styles for this are in globals.css under .layout-list */}
        <Link href={bookmark.url} target="_blank" rel="noopener noreferrer" className="card-link-wrapper group">
          <div className="card-header">
            <div className="card-title-section items-center space-x-3">
              <FaviconDisplay />
              <h3 className="card-title">{bookmark.title}</h3>
              <p className="card-domain">{bookmark.domain}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="card-action-button h-7 w-7" onClick={(e) => e.preventDefault()}>
                <Icons.moreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>编辑</DropdownMenuItem>
              <DropdownMenuItem>移动到...</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive">删除</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Link>
      </div>
    );
  }

  // Grid View (Card)
  return (
    <Card className="bookmark-item group overflow-hidden transition-shadow hover:shadow-xl">
      <Link href={bookmark.url} target="_blank" rel="noopener noreferrer" className="card-link-wrapper block p-5">
        <div className="card-header flex items-start justify-between">
          <div className="card-title-section flex items-center space-x-3">
            <FaviconDisplay />
            <h3 className="card-title text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
              {bookmark.title}
            </h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="card-action-button h-7 w-7 opacity-0 group-hover:opacity-100 focus:opacity-100 -mr-2 -mt-2" onClick={(e) => e.preventDefault()}>
                <Icons.moreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>编辑</DropdownMenuItem>
              <DropdownMenuItem>移动到...</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive">删除</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {bookmark.description && (
          <p className="card-description text-sm text-muted-foreground mt-2 leading-relaxed line-clamp-2">
            {bookmark.description}
          </p>
        )}
        <p className="card-domain text-xs text-primary mt-3 truncate">
          {bookmark.domain}
        </p>
      </Link>
    </Card>
  );
}
