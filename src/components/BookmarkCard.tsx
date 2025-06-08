import React, { useCallback, useState } from 'react'; // Add useState
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Settings } from 'lucide-react';
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
import { Bookmark } from "@prisma/client";
import { deleteBookmarkById } from "@/actions/bookmarks";
import { toast } from "sonner";
import FaviconDisplay from "@/components/FaviconDisplay";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useBookmarkList } from "@/hooks/useBookmarkList";
import { useAuth } from "@/components/AuthContext";

interface BookmarkCardProps {
  bookmark: Bookmark;
  isListView: boolean;
}

export function BookmarkCard({ bookmark, isListView }: BookmarkCardProps) {
  const { isLoggedIn } = useAuth()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { invalidateBookmarkList } = useBookmarkList()

  const bookmarkVisible = !!bookmark.readingProgress

  const handleDeleteBookmark = useCallback(async () => {
    const result = await deleteBookmarkById(bookmark.id)
    if (result.errorMessage) {
      toast.error(result.errorMessage)
    } else {
      toast.success('Delete bookmark successfully')
      invalidateBookmarkList()
    }
  }, [bookmark.id, invalidateBookmarkList]);

  const FaviconDisplayComp = <FaviconDisplay
    isListView={isListView}
    bookmark={{
      title: bookmark.title,
      faviconUrl: bookmark.faviconUrl!
    }}
    // https://www.google.com/s2/favicons?domain=${bookmark.domainName}
    backupFaviconUrl={''}
  />

  if (isListView) {
    return (
      <>
        <div className="bookmark-item h-12 p-4"> {/* Styles for this are in globals.css under .layout-list */}
          {/* Main content: icon, title, domain */}
          <div className="flex items-center flex-grow min-w-0 space-x-3 group"> {/* Link wrapper is now this div */}
            {FaviconDisplayComp}
            <Link href={bookmark.url} target="_blank" rel="noopener noreferrer">
              <div className="card-title-section">
                <h3 className="card-title truncate">{bookmark.title}</h3>
                <p className="card-domain truncate">{bookmark.domainName}</p>
              </div>
            </Link>
          </div>

          {/* Right aligned section: progress bar and actions menu */}
          <div className={"flex items-center space-x-3 flex-shrink-0 ml-4"}>
            {bookmarkVisible && (
              <div className="w-28"> {/* Fixed width for progress bar container */}
                <HorizontalProgressBar value={bookmark.readingProgress || 0} className="h-1.5"/>
              </div>
            )}
            { isLoggedIn && <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="card-action-button h-7 w-7"
                        onClick={(e) => e.preventDefault()}> {/* Ensure button is not part of the link */}
                  <MoreHorizontal className="h-4 w-4"/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setIsEditModalOpen(true)}>Edit</DropdownMenuItem>
                <DropdownMenuItem>Move to...</DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive-foreground">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> }
          </div>
        </div>
        <EditBookmarkModal
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          bookmark={bookmark}
        />
      </>
    );
  }

  // Grid View (Card)
  return (
    <Link href={bookmark.url} target="_blank" rel="noopener noreferrer">
      <Card
        className="bookmark-item relative group overflow-hidden transition-shadow hover:shadow-xl flex flex-col">
        <div className=""> {/* Added flex-grow */}
          <div className="px-4"> {/* Added mb-2 */}
            <div className="card-title-section flex items-start space-x-3">
              {FaviconDisplayComp}
              <div className="flex-grow min-w-0"> {/* Added min-w-0 for better truncation if title is long */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <h3
                      className="card-title text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors truncate">
                      {bookmark.title}
                    </h3>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{bookmark.title}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <div
              className="absolute top-3 right-3 flex flex-col items-end space-y-1"> {/* Container for dropdown and progress */}
              { isLoggedIn && <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="card-action-button opacity-0 group-hover:opacity-100 focus:opacity-100"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Settings className=""/>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => setIsEditModalOpen(true)}>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Move to...</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive focus:text-destructive-foreground"
                                    onClick={handleDeleteBookmark}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> }
            </div>
          </div>
          <p className="card-description text-sm text-muted-foreground leading-relaxed line-clamp-2 my-2 px-4 h-12">
            {bookmark.description}
          </p>
        </div>
        {
          bookmark.ogImageUrl ?
            <img
                src={bookmark.ogImageUrl}
                alt={bookmark.title}
                className='w-full'
            />
            : <div className='relative'>
                <img
                  src={'/img/default-bg.png'}
                  alt={bookmark.title}
                  className='w-full'
                />
              <h2 className='center-absolute w-[80%] text-slate-200 line-clamp-4'>{bookmark.title}</h2>
            </div>
        }
        <div className='flex justify-center items-center px-4 mt-3'>
          <p className="card-domain text-xs text-primary truncate">
            {bookmark.domainName}
          </p>
          <div className='flex-1'/>
          {
              <CircularProgressBar value={bookmark.readingProgress || 0} size={25} strokeWidth={3}
                                   textClassName="text-[9px]" className={cn("opacity-80 group-hover:opacity-100 transition-opacity duration-200",
                bookmarkVisible ? '' : 'invisible'
              )}/>
          }
        </div>
      </Card>
      <EditBookmarkModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        bookmark={bookmark}
      />
    </Link>
  );
}
