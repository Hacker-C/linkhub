"use client"; // This page uses client-side state and effects

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Sidebar }  from '@/components/Sidebar';
import { BookmarkList } from '@/components/BookmarkList';
import { LayoutSwitcher } from '@/components/LayoutSwitcher';
import { SearchInput } from '@/components/SearchInput';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Bookmark, Category } from '@/lib/types';
import { MobileNavMenu } from '@/components/MobileNavMenu'; // For mobile category navigation

// Mock Data
const MOCK_CATEGORIES: Category[] = [
  { id: 'all', name: '所有收藏', itemCount: 12, isPublic: false, subCategories: [] },
  {
    id: 'tech', name: '技术文章', itemCount: 16, isPublic: true,
    subCategories: [
      { id: 'frontend', name: '前端开发', itemCount: 7, isPublic: true, parentId: 'tech' },
      { id: 'backend', name: '后端架构', itemCount: 9, isPublic: false, parentId: 'tech' },
    ]
  },
  { id: 'study', name: '学习资料', itemCount: 5, isPublic: false, subCategories: [] },
  { id: 'design', name: '设计灵感', itemCount: 8, isPublic: true, subCategories: [] },
  { id: 'tools', name: '开发工具', itemCount: 4, isPublic: false, subCategories: [] },
];

const MOCK_BOOKMARKS: Bookmark[] = [
  { id: '1', title: 'Tailwind CSS', url: 'https://tailwindcss.com', description: '一个功能类优先的 CSS 框架，用于快速构建自定义用户界面。', favicon: 'https://tailwindcss.com/favicons/favicon-32x32.png?v=3', domain: 'tailwindcss.com', categoryId: 'frontend' },
  { id: '2', title: 'MDN Web Docs', url: 'https://developer.mozilla.org', description: '面向 Web 开发者的资源，由开发者为开发者创建。', favicon: 'https://developer.mozilla.org/favicon-48x48.cbbd161b.png', domain: 'developer.mozilla.org', categoryId: 'frontend' },
  { id: '3', title: 'Figma', url: 'https://figma.com', domain: 'figma.com', categoryId: 'design', favicon: 'https://static.figma.com/app/icon/1/favicon.png' },
  { id: '4', title: 'GitHub', url: 'https://github.com', description: '全球最大的代码托管平台和开发者社区。', favicon: 'https://github.githubassets.com/favicons/favicon.svg', domain: 'github.com', categoryId: 'tools' },
  { id: '5', title: 'Dribbble', url: 'https://dribbble.com', description: '发现和展示创意设计作品的领先平台。', favicon: 'https://cdn.dribbble.com/assets/favicon-63b29072222e438835926979d754df705a822200100011777d8bf53270a09000.ico', domain: 'dribbble.com', categoryId: 'design' },
  { id: '6', title: 'Unsplash', url: 'https://unsplash.com', description: '互联网上可自由使用的图像来源。', favicon: 'https://unsplash.com/favicon.ico', domain: 'unsplash.com', categoryId: 'design' },
  { id: '7', title: 'Stack Overflow', url: 'https://stackoverflow.com', domain: 'stackoverflow.com', categoryId: 'tech', favicon: 'https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico?v=ec617d715196' },
  { id: '8', title: 'Medium', url: 'https://medium.com', description: '一个开放的平台，数百万读者在这里找到富有洞察力的动态思考。', domain: 'medium.com', categoryId: 'study', favicon: 'https://miro.medium.com/v2/resize:fill:176:176/1*sHhtYhaCe2Uc3IU0IgKwBg.png' },
  { id: '9', title: 'Next.js Docs', url: 'https://nextjs.org/docs', description: 'The React Framework for Production.', domain: 'nextjs.org', categoryId: 'frontend' },
  { id: '10', title: 'Node.js', url: 'https://nodejs.org', description: 'Asynchronous event-driven JavaScript runtime.', domain: 'nodejs.org', categoryId: 'backend' },
  { id: '11', title: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/handbook/intro.html', description: 'Official TypeScript documentation.', domain: 'typescriptlang.org', categoryId: 'frontend' },
  { id: '12', title: 'Shadcn UI', url: 'https://ui.shadcn.com/', description: 'Beautifully designed components built with Radix UI and Tailwind CSS.', domain: 'ui.shadcn.com', categoryId: 'frontend' },
];


export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock login state
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>('all');
  const [displayedBookmarks, setDisplayedBookmarks] = useState<Bookmark[]>(MOCK_BOOKMARKS);
  const [currentCategoryName, setCurrentCategoryName] = useState<string>("所有收藏");


  useEffect(() => {
    // Filter bookmarks based on activeCategoryId
    if (activeCategoryId === 'all') {
      setDisplayedBookmarks(MOCK_BOOKMARKS);
      setCurrentCategoryName("所有收藏");
    } else {
      const findCategoryAndSubs = (catId: string, allCats: Category[]): string[] => {
        const ids: string[] = [catId];
        const cat = allCats.find(c => c.id === catId);
        if (cat && cat.subCategories) {
          cat.subCategories.forEach(sub => ids.push(...findCategoryAndSubs(sub.id, allCats)));
        }
        return ids;
      };
      const activeAndSubCategoryIds = findCategoryAndSubs(activeCategoryId as string, categories);
      setDisplayedBookmarks(MOCK_BOOKMARKS.filter(bm => activeAndSubCategoryIds.includes(bm.categoryId)));

      const getCategoryName = (id: string | null, cats: Category[]): string => {
        if (!id) return "所有收藏";
        for (const cat of cats) {
          if (cat.id === id) return cat.name;
          if (cat.subCategories) {
            const subCatName = getCategoryName(id, cat.subCategories);
            if (subCatName !== "所有收藏") return subCatName; // Found in subcategories
          }
        }
        return "所有收藏"; // Default if not found (should ideally not happen if id is valid)
      };
      setCurrentCategoryName(getCategoryName(activeCategoryId, categories));
    }
  }, [activeCategoryId, categories]);

  const handleLogin = () => {
    console.log("Login action triggered");
    setIsLoggedIn(true);
    // Actual login logic would be here
  };

  const handleRegister = () => {
    console.log("Register action triggered");
    // Actual register logic
  };

  const handleLogout = () => {
    console.log("Logout action triggered");
    setIsLoggedIn(false);
  };

  const handleSelectCategory = (categoryId: string) => {
    setActiveCategoryId(categoryId);
  };

  const handleToggleCategoryVisibility = (categoryId: string, makePublic: boolean) => {
    console.log(`Toggling visibility for ${categoryId} to ${makePublic ? 'public' : 'private'}`);
    // This would typically involve an API call and then updating local state
    // For now, just log and update mock data if needed for UI reflection
    setCategories(prevCategories =>
      prevCategories.map(cat =>
        cat.id === categoryId ? { ...cat, isPublic: makePublic } : cat
      )
    );
    alert(`概念功能：分类 ${categoryId} 已被设为 ${makePublic ? '公开' : '私有'}`);
  };

  const handleAddCategory = () => {
    alert("概念功能：添加新分类");
  }
  const handleAddBookmark = () => {
    alert("概念功能：添加新收藏");
  }


  return (
    <>
      <Header
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onLogout={handleLogout}
      />
      <div className="flex h-[calc(100vh-4rem)]"> {/* Adjust height for sticky nav */}
        {/* Desktop Sidebar */}
        <div className="hidden md:flex">
          <Sidebar
            categories={categories}
            activeCategoryId={activeCategoryId}
            onSelectCategory={handleSelectCategory}
            onToggleCategoryVisibility={handleToggleCategoryVisibility}
            onAddCategory={handleAddCategory}
            isLoggedIn={isLoggedIn}
          />
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 dark:bg-slate-900/50">
          {/* Mobile Header (inside main for scrolling) */}
          <header className="md:hidden flex items-center justify-between mb-6">
            <MobileNavMenu
              categories={categories}
              activeCategoryId={activeCategoryId}
              onSelectCategory={handleSelectCategory}
              onToggleCategoryVisibility={handleToggleCategoryVisibility}
              onAddCategory={handleAddCategory}
              isLoggedIn={isLoggedIn}
            />
            <h2 id="mobile-page-title" className="text-xl font-semibold text-primary">
              {currentCategoryName}
            </h2>
            <div className="w-8"></div> {/* Spacer for centering title */}
          </header>

          {/* Desktop Header for main content area */}
          <div className="hidden md:flex items-center justify-between mb-6">
            <h2 id="desktop-page-title" className="text-2xl font-semibold text-foreground">
              {currentCategoryName}
            </h2>
            <div className="flex items-center space-x-4">
              <SearchInput />
              <LayoutSwitcher currentLayout={layout} onLayoutChange={setLayout} />
              {isLoggedIn && (
                <Button onClick={handleAddBookmark}>
                  <Icons.add className="h-5 w-5 mr-2" />
                  添加收藏
                </Button>
              )}
            </div>
          </div>

          <BookmarkList bookmarks={displayedBookmarks} layout={layout} />

          {/* Mobile Add Bookmark FAB */}
          {isLoggedIn && (
            <Button
              size="icon"
              className="md:hidden fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-20"
              onClick={handleAddBookmark}
              aria-label="添加收藏"
            >
              <Icons.add className="h-7 w-7" />
            </Button>
          )}
        </main>
      </div>
    </>
  );
}