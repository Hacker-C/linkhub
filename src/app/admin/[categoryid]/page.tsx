"use client"

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Sidebar, useSidebar } from '@/components/Sidebar';
import { BookmarkList } from '@/components/BookmarkList';
import { LayoutSwitcher } from '@/components/LayoutSwitcher';
import { SearchInput } from '@/components/SearchInput';
import { Button } from '@/components/ui/button';
import { Plus, RotateCcw } from 'lucide-react';
import { MobileNavMenu } from '@/components/MobileNavMenu';
import AddBookmarkModal from "@/components/bookmarks/AddBookmarkModal";
import { useBookmarkList } from "@/hooks/useBookmarkList";
import { useCategory } from "@/hooks/useCategory";
import { usePageParams } from "@/hooks/usePageParams";
import { CATEGORY_DEFAULT_ID } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function AdminPage() {
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const { refetch } = useBookmarkList()

  const categoryid = usePageParams('categoryid')
  const { category } = useCategory(categoryid)
  const categoryName = categoryid === CATEGORY_DEFAULT_ID ?  'All Links' : category?.name

  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const handleAddBookmark = () => {
    setIsOpen(true)
  }

  const { open } = useSidebar()

  return (
    <>
      <Header />
      <div className="flex h-[calc(100vh-4rem)]"> {/* Adjust height for sticky nav */}
        {/* Desktop Sidebar */}
        <div className={cn('sidebar-hidden transition-all duration-300', open ? '' : '-ml-64')}>
          <Sidebar />
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 dark:bg-slate-900/20">
          {/* Mobile Header (inside main for scrolling) */}
          <header className="md:hidden flex items-center justify-between mb-6">
            <MobileNavMenu />
            <h2 id="mobile-page-title" className="text-xl font-semibold text-primary">
              {categoryName}
            </h2>
            <div className="w-8"></div> {/* Spacer for centering title */}
          </header>

          {/* Desktop Header for main content area */}
          <div className="hidden md:flex items-center justify-between mb-6">
            <h2 id="desktop-page-title" className="text-2xl font-semibold text-foreground">
              {categoryName}
            </h2>
            <div className="flex items-center space-x-4">
              <SearchInput />
              <Button variant="ghost" className="rounded-full" onClick={() => refetch()}>
                <RotateCcw />
              </Button>
              <LayoutSwitcher currentLayout={layout} onLayoutChange={setLayout} />
              <Button onClick={handleAddBookmark}>
                <Plus className="h-5 w-5 mr-2" />
                Add link
              </Button>
            </div>
          </div>

          <BookmarkList layout={layout} />

          {/* Mobile Add IBookmark FAB */}
          <Button
            size="icon"
            className="md:hidden fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-40"
            onClick={handleAddBookmark}
            aria-label="Add link"
          >
            <Plus className="h-7 w-7" />
          </Button>
          <AddBookmarkModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          />
        </main>
      </div>
    </>
  );
}