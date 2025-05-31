import React, { useCallback, useState } from 'react'; // Add useState
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Settings, SquarePen } from 'lucide-react';
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
import { Bookmark } from "@/actions/generated/client";
import { deleteBookmarkById } from "@/actions/bookmarks";
import { toast } from "sonner";
import FaviconDisplay from "@/components/FaviconDisplay";

interface BookmarkCardProps {
  bookmark: Bookmark;
  isListView: boolean;
}

export function BookmarkCard({ bookmark, isListView }: BookmarkCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const bookmarkVisible = !!bookmark.readingProgress

  // const FaviconDisplay = () => (
  //   bookmark.faviconUrl ? (
  //     <img
  //       src={bookmark.faviconUrl}
  //       alt={`${bookmark.title} Favicon`}
  //       width={32}
  //       height={32}
  //       className={cn("card-favicon rounded-md object-contain", isListView ? "w-6 h-6" : "w-8 h-8")}
  //       onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden'); }}
  //     />
  //   ) : (
  //     <div className={cn("card-favicon-placeholder rounded-md bg-muted flex items-center justify-center text-primary font-semibold", isListView ? "w-6 h-6 text-xs" : "w-8 h-8 text-sm")}>
  //       {bookmark.title.charAt(0).toUpperCase()}
  //     </div>
  //   )
  // );

  const handleDeleteBookmark = useCallback(async () => {
    const result = await deleteBookmarkById(bookmark.id)
    if (result.errorMessage) {
      toast.error(result.errorMessage)
    } else {
      toast.success('Delete bookmark successfully')
    }
  }, [bookmark.id]);

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
            <Link href={bookmark.url} target="_blank" rel="noopener noreferrer" className="flex-grow min-w-0">
              <div className="card-title-section">
                <h3 className="card-title truncate">{bookmark.title}</h3>
                <p className="card-domain truncate">{bookmark.domainName}</p>
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
        />
      </>
    );
  }

  // Grid View (Card)
  return (
    <>
      <Card className="bookmark-item relative group overflow-hidden transition-shadow hover:shadow-xl flex flex-col pt-4 pb-2">
        <div className="px-5 flex-grow"> {/* Added flex-grow */}
          <div className="card-header"> {/* Added mb-2 */}
            <div className="card-title-section flex items-start space-x-3">
              {FaviconDisplayComp}
              <div className="flex-grow min-w-0"> {/* Added min-w-0 for better truncation if title is long */}
                <Link href={bookmark.url} target="_blank" rel="noopener noreferrer" className="block">
                  <h3 className="card-title text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors truncate">
                    {bookmark.title}
                  </h3>
                </Link>
              </div>
            </div>
            <div className="absolute top-3 right-3 flex flex-col items-end space-y-1"> {/* Container for dropdown and progress */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="card-action-button opacity-0 group-hover:opacity-100 focus:opacity-100"
                    onClick={(e) => e.preventDefault()}>
                    <Settings className="" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => setIsEditModalOpen(true)}>编辑</DropdownMenuItem>
                  <DropdownMenuItem>移动到...</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive focus:text-destructive-foreground" onClick={handleDeleteBookmark}>删除</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* Circular Progress Bar for Grid View - Placed below dropdown, aligned right */}

            </div>
          </div>
          {bookmark.description && (
            <Link href={bookmark.url} target="_blank" rel="noopener noreferrer" className="block"> {/* Added mt-1 */}
              <p className="card-description text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {bookmark.description}
              </p>
            </Link>
          )}
        </div>
        {
          bookmark.ogImageUrl && <div className='-mt-4'>
            <img
                src={bookmark.ogImageUrl}
                alt={bookmark.title}
                className='w-full'
            />
          </div>
        }
        <div className='flex justify-center items-center -mt-2'>
          <Link href={bookmark.url} target="_blank" rel="noopener noreferrer" className="block px-5"> {/* Adjusted padding for domain */}
            <p className="card-domain text-xs text-primary truncate">
              {bookmark.domainName}
            </p>
          </Link>
          <div className='flex-1' />
          {
            <div className={cn("opacity-80 group-hover:opacity-100 transition-opacity duration-200 mr-5",
              bookmarkVisible ? '' : 'invisible'
            )}>
              <CircularProgressBar value={bookmark.readingProgress || 0} size={40} strokeWidth={3} textClassName="text-[9px]" />
            </div>
          }
        </div>
      </Card>
      <EditBookmarkModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        bookmark={bookmark}
      />
    </>
  );
}
