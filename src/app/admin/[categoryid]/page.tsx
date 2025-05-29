"use client"; // This page uses client-side state and effects

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Sidebar }  from '@/components/Sidebar';
import { BookmarkList } from '@/components/BookmarkList';
import { LayoutSwitcher } from '@/components/LayoutSwitcher';
import { SearchInput } from '@/components/SearchInput';
import { Button } from '@/components/ui/button';
import {  Plus } from 'lucide-react';
import { Bookmark } from "@/actions/generated/client";
import { IBookmark, ICategory } from '@/lib/types';
import { MobileNavMenu } from '@/components/MobileNavMenu';
import { useAuth } from "@/components/AuthContext";
import AddBookmarkModal from "@/components/bookmarks/AddBookmarkModal";

// Mock Data
// const MOCK_CATEGORIES: ICategory[] = [
//   { id: 'all', name: '所有收藏', itemCount: 12, isPublic: false, subCategories: [] },
//   {
//     id: 'tech', name: '技术文章', itemCount: 16, isPublic: true,
//     subCategories: [
//       { id: 'frontend', name: '前端开发', itemCount: 7, isPublic: true, parentId: 'tech' },
//       { id: 'backend', name: '后端架构', itemCount: 9, isPublic: false, parentId: 'tech' },
//     ]
//   },
//   { id: 'study', name: '学习资料', itemCount: 5, isPublic: false, subCategories: [] },
//   { id: 'design', name: '设计灵感', itemCount: 8, isPublic: true, subCategories: [] },
//   { id: 'tools', name: '开发工具', itemCount: 4, isPublic: false, subCategories: [] },
// ];
//
// const MOCK_BOOKMARKS: IBookmark[] = [
//   { id: '1', title: 'Tailwind CSS', url: 'https://tailwindcss.com', description: '一个功能类优先的 CSS 框架，用于快速构建自定义用户界面。', favicon: 'https://tailwindcss.com/favicons/favicon-32x32.png?v=3', domain: 'tailwindcss.com', categoryId: 'frontend' },
//   { id: '2', title: 'MDN Web Docs', url: 'https://developer.mozilla.org', description: '面向 Web 开发者的资源，由开发者为开发者创建。', favicon: 'https://developer.mozilla.org/favicon-48x48.cbbd161b.png', domain: 'developer.mozilla.org', categoryId: 'frontend' },
//   { id: '3', title: 'Figma', url: 'https://figma.com', domain: 'figma.com', categoryId: 'design', favicon: 'https://static.figma.com/app/icon/1/favicon.png' },
//   { id: '4', title: 'GitHub', url: 'https://github.com', description: '全球最大的代码托管平台和开发者社区。', favicon: 'https://github.githubassets.com/favicons/favicon.svg', domain: 'github.com', categoryId: 'tools' },
//   { id: '5', title: 'Dribbble', url: 'https://dribbble.com', description: '发现和展示创意设计作品的领先平台。', favicon: 'https://cdn.dribbble.com/assets/favicon-63b29072222e438835926979d754df705a822200100011777d8bf53270a09000.ico', domain: 'dribbble.com', categoryId: 'design' },
//   { id: '6', title: 'Unsplash', url: 'https://unsplash.com', description: '互联网上可自由使用的图像来源。', favicon: 'https://unsplash.com/favicon.ico', domain: 'unsplash.com', categoryId: 'design' },
//   { id: '7', title: 'Stack Overflow', url: 'https://stackoverflow.com', domain: 'stackoverflow.com', categoryId: 'tech', favicon: 'https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico?v=ec617d715196' },
//   { id: '8', title: 'Medium', url: 'https://medium.com', description: '一个开放的平台，数百万读者在这里找到富有洞察力的动态思考。', domain: 'medium.com', categoryId: 'study', favicon: 'https://miro.medium.com/v2/resize:fill:176:176/1*sHhtYhaCe2Uc3IU0IgKwBg.png' },
//   { id: '9', title: 'Next.js Docs', url: 'https://nextjs.org/docs', description: 'The React Framework for Production.', domain: 'nextjs.org', categoryId: 'frontend' },
//   { id: '10', title: 'Node.js', url: 'https://nodejs.org', description: 'Asynchronous event-driven JavaScript runtime.', domain: 'nodejs.org', categoryId: 'backend' },
//   { id: '11', title: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/handbook/intro.html', description: 'Official TypeScript documentation.', domain: 'typescriptlang.org', categoryId: 'frontend' },
//   { id: '12', title: 'Shadcn UI', url: 'https://ui.shadcn.com/', description: 'Beautifully designed components built with Radix UI and Tailwind CSS.', domain: 'ui.shadcn.com', categoryId: 'frontend' },
// ];


export default function AdminPage() {
  const { isLoggedIn } = useAuth()
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');


  const handleToggleCategoryVisibility = (categoryId: string, makePublic: boolean) => {
    // todo
    alert(`概念功能：分类 ${categoryId} 已被设为 ${makePublic ? '公开' : '私有'}`);
  };

  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const handleAddBookmark = () => {
    setIsOpen(true)
  }

  return (
    <>
      <Header
        isLoggedIn={isLoggedIn}
      />
      <div className="flex h-[calc(100vh-4rem)]"> {/* Adjust height for sticky nav */}
        {/* Desktop Sidebar */}
        <div className="hidden md:flex">
          <Sidebar
            onToggleCategoryVisibility={handleToggleCategoryVisibility}
            isLoggedIn={isLoggedIn}
          />
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 dark:bg-slate-900/20">
          {/* Mobile Header (inside main for scrolling) */}
          <header className="md:hidden flex items-center justify-between mb-6">
            <MobileNavMenu
              onToggleCategoryVisibility={handleToggleCategoryVisibility}
              isLoggedIn={isLoggedIn}
            />
            <h2 id="mobile-page-title" className="text-xl font-semibold text-primary">
              {'当前目录名称'}
            </h2>
            <div className="w-8"></div> {/* Spacer for centering title */}
          </header>

          {/* Desktop Header for main content area */}
          <div className="hidden md:flex items-center justify-between mb-6">
            <h2 id="desktop-page-title" className="text-2xl font-semibold text-foreground">
              {'当前目录名称'}
            </h2>
            <div className="flex items-center space-x-4">
              <SearchInput />
              <LayoutSwitcher currentLayout={layout} onLayoutChange={setLayout} />
              {isLoggedIn && (
                <Button onClick={handleAddBookmark}>
                  <Plus className="h-5 w-5 mr-2" />
                  Add link
                </Button>
              )}
            </div>
          </div>

          <BookmarkList layout={layout} />

          {/* Mobile Add IBookmark FAB */}
          {isLoggedIn && (
            <Button
              size="icon"
              className="md:hidden fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-40"
              onClick={handleAddBookmark}
              aria-label="Add link"
            >
              <Plus className="h-7 w-7" />
            </Button>
          )}

          <AddBookmarkModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          />
        </main>
      </div>
    </>
  );
}