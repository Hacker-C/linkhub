export const queryKeys = {
  queryBookmarksByCategoryId: (categoryId: string) => ['queryBookmarksByCategoryId', categoryId],
  queryCategories: () => ['queryCategories'],
  queryCategoryId: (id: string) => ['queryCategoryId', id],
  queryCategoryByShortId: (shortId: string) => ['queryCategoryByShortId', shortId],
  queryPublicCategoriesOfUser: (username: string) => ['queryPublicCategoriesOfUser', username],
}
