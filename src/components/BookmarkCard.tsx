import React, { useState } from 'react'; // Add useState
import Link from 'next/link';
import Image from 'next/image'; // For favicons
import { Bookmark } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from '@/components/ui/card'; // Using shadcn Card as base
import { HorizontalProgressBar } from '@/components/ui/HorizontalProgressBar'; 
import { CircularProgressBar } from '@/components/ui/CircularProgressBar';   
import { EditBookmarkModal } from '@/components/bookmarks/EditBookmarkModal'; 

interface BookmarkCardProps {
  bookmark: Bookmark; // Renamed from initialBookmark for clarity in props definition
  isListView: boolean;
}

export function BookmarkCard({ bookmark: initialBookmark, isListView }: BookmarkCardProps) {
  const [bookmark, setBookmark] = useState<Bookmark>(initialBookmark); 
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const bookmarkVisible = !!bookmark.readingProgress

  const handleSaveBookmark = (updatedBookmark: Bookmark) => {
    setBookmark(updatedBookmark); 
    console.log("Bookmark updated (client-side):", updatedBookmark);
    // In a real app, you'd call an API to save to backend here
    setIsEditModalOpen(false);
  };

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
      <>
        <div className="bookmark-item h-12 p-4"> {/* Styles for this are in globals.css under .layout-list */}
          {/* Main content: icon, title, domain */}
          <div className="flex items-center flex-grow min-w-0 space-x-3 group"> {/* Link wrapper is now this div */}
            <FaviconDisplay />
            <Link href={bookmark.url} target="_blank" rel="noopener noreferrer" className="flex-grow min-w-0">
              <div className="card-title-section">
                <h3 className="card-title truncate">{bookmark.title}</h3>
                <p className="card-domain truncate">{bookmark.domain}</p>
              </div>
            </Link>
          </div>
          
          {/* Right aligned section: progress bar and actions menu */}
          <div className={"flex items-center space-x-3 flex-shrink-0 ml-4"} >
            {bookmarkVisible && (
              <div className="w-28"> {/* Fixed width for progress bar container */}
                <HorizontalProgressBar value={bookmark.readingProgress || 0} className="h-1.5" />
              </div>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="card-action-button h-7 w-7" onClick={(e) => e.preventDefault()}> {/* Ensure button is not part of the link */}
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setIsEditModalOpen(true)}>编辑</DropdownMenuItem>
                <DropdownMenuItem>移动到...</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive focus:text-destructive-foreground">删除</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <EditBookmarkModal
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          bookmark={bookmark}
          onSave={handleSaveBookmark}
        />
      </>
    );
  }

  // Grid View (Card)
  return (
    <>
      <Card className="bookmark-item group overflow-hidden transition-shadow hover:shadow-xl flex flex-col"> {/* Added flex flex-col */}
        <div className="px-5 py-2 flex-grow"> {/* Added flex-grow */}
          <div className="card-header flex items-start justify-between mb-2"> {/* Added mb-2 */}
            <div className="card-title-section flex items-start space-x-3">
              <FaviconDisplay />
              <div className="flex-grow min-w-0"> {/* Added min-w-0 for better truncation if title is long */}
                <Link href={bookmark.url} target="_blank" rel="noopener noreferrer" className="block">
                  <h3 className="card-title text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors truncate">
                    {bookmark.title}
                  </h3>
                </Link>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-1"> {/* Container for dropdown and progress */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="card-action-button h-7 w-7 opacity-0 group-hover:opacity-100 focus:opacity-100" onClick={(e) => e.preventDefault()}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => setIsEditModalOpen(true)}>编辑</DropdownMenuItem>
                  <DropdownMenuItem>移动到...</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive focus:text-destructive-foreground">删除</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* Circular Progress Bar for Grid View - Placed below dropdown, aligned right */}
              {
                <div className={cn("opacity-80 group-hover:opacity-100 transition-opacity duration-200", 
                  bookmarkVisible ? '' : 'invisible'
                )}>
                  <CircularProgressBar value={bookmark.readingProgress || 0} size={40} strokeWidth={3} textClassName="text-[9px]" />
                </div>
              }
            </div>
          </div>
          {bookmark.description && (
            <Link href={bookmark.url} target="_blank" rel="noopener noreferrer" className="block mt-1"> {/* Added mt-1 */}
              <p className="card-description text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {bookmark.description}
              </p>
            </Link>
          )}
        </div>
        <Link href={bookmark.url} target="_blank" rel="noopener noreferrer" className="block px-5 pb-2 pt-2"> {/* Adjusted padding for domain */}
          <p className="card-domain text-xs text-primary truncate">
            {bookmark.domain}
          </p>
        </Link>
      </Card>
      <EditBookmarkModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        bookmark={bookmark}
        onSave={handleSaveBookmark}
      />
    </>
  );
}
// This is a placeholder for the diff tool.
// The actual content has been provided above in the SEARCH/REPLACE blocks.
// If you are seeing this, it means the diff tool did not correctly process the combined diff.
// Please refer to the individual SEARCH/REPLACE blocks for BookmarkCard.tsx.
