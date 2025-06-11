import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BookmarkList } from '../BookmarkList'; // Adjust path assuming it's in ../
import { useBookmarkList } from '@/hooks/useBookmarkList';
import { Bookmark } from '@prisma/client'; // Assuming Bookmark type is needed

// Mock the hook
jest.mock('@/hooks/useBookmarkList');

// Mock Lucide icons (like Loader)
jest.mock('lucide-react', () => ({
  ...jest.requireActual('lucide-react'), // Import and retain default behavior
  Loader: () => <div role="progressbar">Loader</div>, // Simple mock for Loader
}));


describe('BookmarkList', () => {
  const mockUseBookmarkList = useBookmarkList as jest.MockedFunction<typeof useBookmarkList>;
  const mockFetchNextPage = jest.fn();
  const mockInvalidateBookmarkList = jest.fn();
  const mockDoOperateOnBookmarkCacheData = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    mockUseBookmarkList.mockReset();
    mockFetchNextPage.mockClear();
    mockInvalidateBookmarkList.mockClear();
    mockDoOperateOnBookmarkCacheData.mockClear();
  });

  it('should display loading state initially', () => {
    mockUseBookmarkList.mockReturnValue({
      isLoading: true,
      data: undefined,
      fetchNextPage: mockFetchNextPage,
      hasNextPage: false,
      isFetchingNextPage: false,
      invalidateBookmarkList: mockInvalidateBookmarkList,
      doOperateOnBookmarkCacheData: mockDoOperateOnBookmarkCacheData,
    });
    render(<BookmarkList layout="grid" />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('Loader')).toBeInTheDocument(); // Check for our mock Loader text
  });

  it('should display empty state when no bookmarks are present after loading', () => {
    mockUseBookmarkList.mockReturnValue({
      isLoading: false,
      data: { pages: [{ data: [], nextCursor: undefined }], pageParams: [undefined] },
      fetchNextPage: mockFetchNextPage,
      hasNextPage: false,
      isFetchingNextPage: false,
      invalidateBookmarkList: mockInvalidateBookmarkList,
      doOperateOnBookmarkCacheData: mockDoOperateOnBookmarkCacheData,
    });
    render(<BookmarkList layout="grid" />);
    expect(screen.getByText(/You don't have any bookmarks yet./i)).toBeInTheDocument();
  });

  const dummyBookmarks: Bookmark[] = [
    { id: '1', title: 'Bookmark 1', url: 'http://url1.com', categoryId: 'cat1', userId: 'user1', description: null, faviconUrl: null, ogImageUrl: null, domainName: null, createdAt: new Date(), updatedAt: new Date(), deletedAt: null },
    { id: '2', title: 'Bookmark 2', url: 'http://url2.com', categoryId: 'cat1', userId: 'user1', description: null, faviconUrl: null, ogImageUrl: null, domainName: null, createdAt: new Date(), updatedAt: new Date(), deletedAt: null },
  ];

  it('should display initial bookmarks and a "Load More" button if hasNextPage is true', () => {
    mockUseBookmarkList.mockReturnValue({
      isLoading: false,
      data: {
        pages: [
          { data: [dummyBookmarks[0]], nextCursor: 'cursor1' }
        ],
        pageParams: [undefined],
      },
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: false,
      invalidateBookmarkList: mockInvalidateBookmarkList,
      doOperateOnBookmarkCacheData: mockDoOperateOnBookmarkCacheData,
    });
    render(<BookmarkList layout="grid" />);
    expect(screen.getByText('Bookmark 1')).toBeInTheDocument();
    const loadMoreButton = screen.getByRole('button', { name: /Load More/i });
    expect(loadMoreButton).toBeInTheDocument();
    expect(loadMoreButton).not.toBeDisabled();
  });

  it('should call fetchNextPage when "Load More" button is clicked', () => {
    mockUseBookmarkList.mockReturnValue({
      isLoading: false,
      data: {
        pages: [
          { data: [dummyBookmarks[0]], nextCursor: 'cursor1' }
        ],
        pageParams: [undefined],
      },
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: false,
      invalidateBookmarkList: mockInvalidateBookmarkList,
      doOperateOnBookmarkCacheData: mockDoOperateOnBookmarkCacheData,
    });
    render(<BookmarkList layout="grid" />);
    const loadMoreButton = screen.getByRole('button', { name: /Load More/i });
    fireEvent.click(loadMoreButton);
    expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
  });

  it('should display "Loading more..." and disable "Load More" button when isFetchingNextPage is true', () => {
    mockUseBookmarkList.mockReturnValue({
      isLoading: false,
      data: {
        pages: [
          { data: [dummyBookmarks[0]], nextCursor: 'cursor1' }
        ],
        pageParams: [undefined],
      },
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: true,
      invalidateBookmarkList: mockInvalidateBookmarkList,
      doOperateOnBookmarkCacheData: mockDoOperateOnBookmarkCacheData,
    });
    render(<BookmarkList layout="grid" />);
    const loadMoreButton = screen.getByRole('button', { name: /Loading more.../i });
    expect(loadMoreButton).toBeInTheDocument();
    expect(loadMoreButton).toBeDisabled();
    expect(screen.getByText('Loader')).toBeInTheDocument(); // Check for loader icon within button
  });

  it('should not display "Load More" button and show "No more bookmarks" message when hasNextPage is false after loading all items', () => {
    mockUseBookmarkList.mockReturnValue({
      isLoading: false,
      data: {
        pages: [
          { data: dummyBookmarks, nextCursor: undefined } // All bookmarks loaded, no next cursor
        ],
        pageParams: [undefined],
      },
      fetchNextPage: mockFetchNextPage,
      hasNextPage: false, // No next page
      isFetchingNextPage: false,
      invalidateBookmarkList: mockInvalidateBookmarkList,
      doOperateOnBookmarkCacheData: mockDoOperateOnBookmarkCacheData,
    });
    render(<BookmarkList layout="grid" />);
    expect(screen.getByText('Bookmark 1')).toBeInTheDocument();
    expect(screen.getByText('Bookmark 2')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Load More/i })).not.toBeInTheDocument();
    expect(screen.getByText(/No more bookmarks to load./i)).toBeInTheDocument();
  });

  it('should display all bookmarks when multiple pages are loaded', () => {
    mockUseBookmarkList.mockReturnValue({
      isLoading: false,
      data: {
        pages: [
          { data: [dummyBookmarks[0]], nextCursor: 'cursor1' },
          { data: [dummyBookmarks[1]], nextCursor: undefined }
        ],
        pageParams: [undefined, 'cursor1'],
      },
      fetchNextPage: mockFetchNextPage,
      hasNextPage: false, // All pages loaded
      isFetchingNextPage: false,
      invalidateBookmarkList: mockInvalidateBookmarkList,
      doOperateOnBookmarkCacheData: mockDoOperateOnBookmarkCacheData,
    });
    render(<BookmarkList layout="grid" />);
    expect(screen.getByText('Bookmark 1')).toBeInTheDocument();
    expect(screen.getByText('Bookmark 2')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Load More/i })).not.toBeInTheDocument();
    expect(screen.getByText(/No more bookmarks to load./i)).toBeInTheDocument();
  });
});
